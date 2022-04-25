import TaskAPI, {
  IDeleteTaskEndpointParams,
} from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import TaskActions from "../../tasks/actions";
import { IStoreLikeObject } from "../../types";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const deleteTaskOpAction = makeAsyncOp(
  "op/tasks/deleteTask",
  OperationType.DeleteTask,
  async (arg: IDeleteTaskEndpointParams, thunkAPI, extras) => {
    if (extras.isDemoMode) {
    } else {
      const result = await TaskAPI.deleteTask(arg);
      assertEndpointResult(result);
    }

    completeDeleteTask(thunkAPI, arg.taskId);
  },
  {
    preFn: (arg) => ({
      resourceId: arg.taskId,
    }),
  }
);

export function completeDeleteTask(thunkAPI: IStoreLikeObject, taskId: string) {
  thunkAPI.dispatch(TaskActions.remove(taskId));
}
