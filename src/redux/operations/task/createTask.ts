import assert from "assert";
import { defaultTo } from "lodash";
import { BlockType } from "../../../models/block/block";
import { messages } from "../../../models/messages";
import { ITask, ITaskFormValues } from "../../../models/task/types";
import { getNewTaskInput } from "../../../models/task/utils";
import TaskAPI, {
  ICreateTaskEndpointParams,
} from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, getNewId } from "../../../utils/utils";
import SessionSelectors from "../../session/selectors";
import TaskActions from "../../tasks/actions";
import { IStoreLikeObject } from "../../types";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const createTaskOpAction = makeAsyncOp(
  "op/tasks/createTask",
  OperationType.CreateTask,
  async (
    arg: Omit<ICreateTaskEndpointParams, "task"> & {
      task: Partial<ITaskFormValues>;
    },
    thunkAPI,
    extras
  ) => {
    let task: ITask | null = null;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    const createTaskInput = getNewTaskInput(arg.task);

    if (extras.isDemoMode) {
      task = {
        customId: getNewId(),
        createdBy: user.customId,
        createdAt: getDateString(),
        type: BlockType.Task,
        rootBlockId: createTaskInput.parent,
        name: createTaskInput.name,
        description: createTaskInput.description,
        parent: createTaskInput.parent,
        dueAt: createTaskInput.dueAt,
        status: createTaskInput.status,
        taskResolution: createTaskInput.taskResolution,
        priority: createTaskInput.priority,
        taskSprint: createTaskInput.taskSprint && {
          ...createTaskInput.taskSprint,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        },

        assignees: defaultTo(createTaskInput.assignees, []).map((item) => ({
          ...item,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        })),

        subTasks: defaultTo(createTaskInput.subTasks, []).map((item) => ({
          ...item,
          createdAt: getDateString(),
          createdBy: user.customId,
        })),

        labels: defaultTo(createTaskInput.labels, []).map((item) => ({
          ...item,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        })),
      };
    } else {
      const result = await TaskAPI.createTask({
        task: createTaskInput,
      });

      assertEndpointResult(result);
      task = result.task;
    }

    assert(task, messages.internalError);
    completeCreateTask(thunkAPI, task);
    return task;
  }
);

export function completeCreateTask(thunkAPI: IStoreLikeObject, task: ITask) {
  thunkAPI.dispatch(
    TaskActions.add({
      id: task.customId,
      data: task,
    })
  );
}
