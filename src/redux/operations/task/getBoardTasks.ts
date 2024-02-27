import { ITask } from "../../../models/task/types";
import TaskAPI, { IGetBoardTasksEndpointParams } from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import TaskActions from "../../tasks/actions";
import { toActionAddList } from "../../utils";
import { makeAsyncOp02 } from "../utils";

export const getBoardTasksOpAction = makeAsyncOp02(
  "op/tasks/getBoardTasks",
  async (arg: IGetBoardTasksEndpointParams, thunkAPI, extras) => {
    let tasks: ITask[] = [];
    if (!extras.isDemoMode) {
      const result = await TaskAPI.getBoardTasks({
        boardId: arg.boardId,
      });
      assertEndpointResult(result);
      tasks = result.tasks;
    }

    thunkAPI.dispatch(TaskActions.bulkUpdate(toActionAddList(tasks, "customId")));
  }
);
