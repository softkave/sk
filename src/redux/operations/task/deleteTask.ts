import TaskAPI, { IDeleteTaskEndpointParams } from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import TaskActions from "../../tasks/actions";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";

export const deleteTaskOpAction = makeAsyncOp02NoPersist(
  "op/tasks/deleteTask",
  async (arg: IDeleteTaskEndpointParams, thunkAPI, extras) => {
    if (extras.isDemoMode) {
    } else {
      const result = await TaskAPI.deleteTask(arg);
      assertEndpointResult(result);
    }

    completeDeleteTask(thunkAPI, arg.taskId);
  }
);

export function completeDeleteTask(thunkAPI: IStoreLikeObject, taskId: string) {
  thunkAPI.dispatch(TaskActions.remove(taskId));
}
