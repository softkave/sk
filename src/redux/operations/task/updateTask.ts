import assert from "assert";
import { defaultTo } from "lodash";
import { messages } from "../../../models/messages";
import TaskAPI, {
  IUpdateTaskEndpointParams,
} from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, processComplexTypeInput } from "../../../utils/utils";
import TaskActions from "../../tasks/actions";
import TaskSelectors from "../../tasks/selectors";
import SessionSelectors from "../../session/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";
import { IStoreLikeObject } from "../../types";
import { ITask } from "../../../models/task/types";
import { ITaskFormValues } from "../../../components/task/TaskForm";
import { getUpdateTaskInput } from "../../../models/task/utils";

export const updateTaskOpAction = makeAsyncOp(
  "op/tasks/updateTask",
  OperationType.UpdateTask,
  async (
    arg: Omit<IUpdateTaskEndpointParams, "data"> & {
      data: Partial<ITaskFormValues>;
    },
    thunkAPI,
    extras
  ) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    let task = TaskSelectors.assertGetOne(thunkAPI.getState(), arg.taskId);
    assignUserToTaskOnUpdateStatus(thunkAPI, task, arg.data);
    const updateTaskInput = getUpdateTaskInput(task, arg.data);

    if (extras.isDemoMode) {
      task = {
        ...task,
        updatedBy: user.customId,
        updatedAt: getDateString(),
        name: defaultTo(updateTaskInput.name, task.name),
        description: defaultTo(updateTaskInput.description, task.description),
        priority: defaultTo(updateTaskInput.priority, task.priority),
        parent: defaultTo(updateTaskInput.parent, task.parent),
        dueAt: defaultTo(updateTaskInput.dueAt, task.dueAt),
        status: defaultTo(updateTaskInput.status, task.status),
        taskResolution: defaultTo(
          updateTaskInput.taskResolution,
          task.taskResolution
        ),
        assignees: updateTaskInput.assignees
          ? processComplexTypeInput(
              task.assignees,
              updateTaskInput.assignees,
              "userId",
              (item) => ({
                ...item,
                assignedAt: getDateString(),
                assignedBy: user.customId,
              })
            )
          : task.assignees,

        labels: updateTaskInput.labels
          ? processComplexTypeInput(
              task.labels,
              updateTaskInput.labels,
              "customId",
              (item) => ({
                ...item,
                assignedAt: getDateString(),
                assignedBy: user.customId,
              })
            )
          : task.labels,

        subTasks: updateTaskInput.subTasks
          ? processComplexTypeInput(
              task.subTasks,
              updateTaskInput.subTasks,
              "customId",
              (item) => ({
                ...item,
                createdAt: getDateString(),
                createdBy: user.customId,
              })
            )
          : task.subTasks,

        taskSprint: updateTaskInput.taskSprint
          ? {
              ...updateTaskInput.taskSprint,
              assignedAt: getDateString(),
              assignedBy: user.customId,
            }
          : task.taskSprint,
      };
    } else {
      const result = await TaskAPI.updateTask({
        taskId: arg.taskId,
        data: updateTaskInput,
      });

      assertEndpointResult(result);
      task = result.task;
    }

    assert(task, messages.internalError);
    thunkAPI.dispatch(
      TaskActions.update({
        id: task.customId,
        data: task,
      })
    );

    return task;
  }
);

function assignUserToTaskOnUpdateStatus(
  store: IStoreLikeObject,
  task: ITask,
  data: Partial<ITaskFormValues>
) {
  if (data.status && data.status !== task.status) {
    const assignees = data.assignees || task.assignees || [];

    if (assignees.length === 0) {
      const user = SessionSelectors.assertGetUser(store.getState());
      data.assignees = [{ userId: user.customId }];
    }
  }
}
