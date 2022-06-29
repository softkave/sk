import assert from "assert";
import { defaultTo, last, merge } from "lodash";
import { messages } from "../../../models/messages";
import { ITask, ITaskFormValues } from "../../../models/task/types";
import {
  assignCollaborators,
  getUpdateTaskInput,
} from "../../../models/task/utils";
import TaskAPI, {
  IUpdateTaskEndpointParams,
} from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, processComplexTypeInput } from "../../../utils/utils";
import BoardSelectors from "../../boards/selectors";
import SessionSelectors from "../../session/selectors";
import TaskActions from "../../tasks/actions";
import TaskSelectors from "../../tasks/selectors";
import { IStoreLikeObject } from "../../types";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

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
    assignUserToTaskIfStatusChanged(thunkAPI, task, arg.data);
    const updateTaskInput = getUpdateTaskInput(task, arg.data);

    if (extras.isDemoMode) {
      const updates = {
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

      if (arg.data.parent && arg.data.parent !== task.parent) {
        const board = BoardSelectors.getOne(
          thunkAPI.getState(),
          arg.data.parent
        );

        const status0 = board && last(board.boardStatuses);
        const transferTaskUpdates: Partial<ITask> = {
          parent: arg.data.parent,
          status: status0?.customId,
          statusAssignedBy: user.customId,
          statusAssignedAt: getDateString(),
          labels: [],
          taskSprint: undefined,
        };

        task = merge(updates, transferTaskUpdates);
      }
    } else {
      const result = await TaskAPI.updateTask({
        taskId: arg.taskId,
        data: updateTaskInput,
      });

      assertEndpointResult(result);
      task = result.task;
    }

    assert(task, messages.internalError);
    completeUpdateTask(thunkAPI, task);
    return task;
  },
  {
    preFn: (arg) => ({
      resourceId: arg.taskId,
    }),
  }
);

function assignUserToTaskIfStatusChanged(
  store: IStoreLikeObject,
  task: ITask,
  data: Partial<ITaskFormValues>
) {
  if (data.status && data.status !== task.status) {
    const assignees = data.assignees || task.assignees || [];
    if (assignees.length === 0) {
      const user = SessionSelectors.assertGetUser(store.getState());
      data.assignees = assignCollaborators(
        data,
        [user],
        user.customId
      ).assignees;
    }
  }
}

export function completeUpdateTask(thunkAPI: IStoreLikeObject, task: ITask) {
  thunkAPI.dispatch(
    TaskActions.update({
      id: task.customId,
      data: task,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}
