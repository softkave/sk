import BoardAPI, {
  IDeleteBoardEndpointParams,
} from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import BoardActions from "../../boards/actions";
import SprintActions from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
import TaskActions from "../../tasks/actions";
import { getBoardTasks } from "../../tasks/selectors";
import { IStoreLikeObject } from "../../types";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const deleteBoardOpAction = makeAsyncOp(
  "op/boards/deleteBoard",
  OperationType.DeleteBoard,
  async (arg: IDeleteBoardEndpointParams, thunkAPI, extras) => {
    if (extras.isDemoMode) {
    } else {
      const result = await BoardAPI.deleteBoard(arg);
      assertEndpointResult(result);
    }

    completeDeleteBoard(thunkAPI, arg.boardId);
  },
  {
    preFn: (arg) => ({
      resourceId: arg.boardId,
    }),
  }
);

function deleteBoardTasks(thunkAPI: IStoreLikeObject, boardId: string) {
  const tasks = getBoardTasks(thunkAPI.getState(), boardId);
  thunkAPI.dispatch(TaskActions.bulkDelete(tasks.map((item) => item.customId)));
}

function deleteBoardSprints(thunkAPI: IStoreLikeObject, boardId: string) {
  const sprints = SprintSelectors.getBoardSprints(thunkAPI.getState(), boardId);
  thunkAPI.dispatch(
    SprintActions.bulkDeleteSprints(sprints.map((item) => item.customId))
  );
}

export function completeDeleteBoard(
  thunkAPI: IStoreLikeObject,
  boardId: string
) {
  thunkAPI.dispatch(BoardActions.remove(boardId));
  deleteBoardTasks(thunkAPI, boardId);
  deleteBoardSprints(thunkAPI, boardId);
}
