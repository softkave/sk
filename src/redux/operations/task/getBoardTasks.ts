import { ITask } from "../../../models/task/types";
import TaskAPI, {
  IGetBoardTasksEndpointParams,
} from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import TaskActions from "../../tasks/actions";
import { toActionAddList } from "../../utils";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const getBoardTasksOpAction = makeAsyncOp(
  "op/tasks/getBoardTasks",
  OperationType.GetBoardTasks,
  async (arg: IGetBoardTasksEndpointParams, thunkAPI, extras) => {
    let tasks: ITask[] = [];

    if (extras.isDemoMode) {
    } else {
      const result = await TaskAPI.getBoardTasks({
        boardId: arg.boardId,
      });
      assertEndpointResult(result);
      tasks = result.tasks;
    }

    thunkAPI.dispatch(TaskActions.bulkAdd(toActionAddList(tasks, "customId")));
  },
  {
    preFn: (arg) => ({
      resourceId: arg.boardId,
    }),
  }
);
