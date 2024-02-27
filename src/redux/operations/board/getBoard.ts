import BoardAPI, { IGetBoardEndpointParams } from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import BoardActions from "../../boards/actions";
import { makeAsyncOp02 } from "../utils";

export const getBoardOpAction = makeAsyncOp02(
  "op/boards/getBoard",
  async (arg: IGetBoardEndpointParams, thunkAPI, extras) => {
    if (extras.isDemoMode) {
      throw new Error("Board not found");
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
  }
);
