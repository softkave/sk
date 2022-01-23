import BoardAPI, {
  IGetBoardEndpointParams,
} from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const getBoardOpAction = makeAsyncOp(
  "op/boards/getBoard",
  OperationType.GetBoard,
  async (arg: IGetBoardEndpointParams, thunkAPI, extras) => {
    let board = BoardSelectors.assertGetOne(thunkAPI.getState(), arg.boardId);

    if (extras.isDemoMode) {
    } else {
      const result = await BoardAPI.getBoard(arg);
      assertEndpointResult(result);
      board = result.board;
      thunkAPI.dispatch(
        BoardActions.update({
          id: board.customId,
          data: board,
        })
      );
    }
  }
);
