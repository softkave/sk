import BoardAPI, {
  IGetBoardEndpointParams,
} from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import BoardActions from "../../boards/actions";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const getBoardOpAction = makeAsyncOp(
  "op/boards/getBoard",
  OperationType.GetBoard,
  async (arg: IGetBoardEndpointParams, thunkAPI, extras) => {
    if (extras.isDemoMode) {
    } else {
      const result = await BoardAPI.getBoard({
        boardId: arg.boardId,
      });
      assertEndpointResult(result);
      const board = result.board;
      thunkAPI.dispatch(
        BoardActions.update({
          id: board.customId,
          data: board,
          meta: { arrayUpdateStrategy: "replace" },
        })
      );
    }
  },
  {
    preFn: (arg) => ({
      resourceId: arg.boardId,
    }),
  }
);
