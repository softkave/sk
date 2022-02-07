import assert from "assert";
import { BlockType } from "../../../models/block/block";
import { messages } from "../../../models/messages";
import { ITask } from "../../../models/task/types";
import TaskAPI, {
  ICreateTaskEndpointParams,
} from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, getNewId } from "../../../utils/utils";
import TaskActions from "../../tasks/actions";
import SessionSelectors from "../../session/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";
import { defaultTo } from "lodash";

export const createTaskOpAction = makeAsyncOp(
  "op/tasks/createTask",
  OperationType.CreateTask,
  async (arg: ICreateTaskEndpointParams, thunkAPI, extras) => {
    let task: ITask | null = null;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (extras.isDemoMode) {
      task = {
        customId: getNewId(),
        createdBy: user.customId,
        createdAt: getDateString(),
        type: BlockType.Task,
        rootBlockId: arg.task.parent,
        name: arg.task.name,
        description: arg.task.description,
        parent: arg.task.parent,
        dueAt: arg.task.dueAt,
        status: arg.task.status,
        taskResolution: arg.task.taskResolution,
        priority: arg.task.priority,
        taskSprint: arg.task.taskSprint && {
          ...arg.task.taskSprint,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        },

        assignees: defaultTo(arg.task.assignees, []).map((item) => ({
          ...item,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        })),

        subTasks: defaultTo(arg.task.subTasks, []).map((item) => ({
          ...item,
          createdAt: getDateString(),
          createdBy: user.customId,
        })),

        labels: defaultTo(arg.task.labels, []).map((item) => ({
          ...item,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        })),
      };
    } else {
      const result = await TaskAPI.createTask({
        task: arg.task,
      });

      assertEndpointResult(result);
      task = result.task;
    }

    assert(task, messages.internalError);
    thunkAPI.dispatch(
      TaskActions.add({
        id: task.customId,
        data: task,
      })
    );

    return task;
  }
);
