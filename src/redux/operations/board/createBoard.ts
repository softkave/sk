import assert from "assert";
import { BlockType } from "../../../models/block/block";
import { messages } from "../../../models/messages";
import { IBoard } from "../../../models/board/types";
import BoardAPI, {
  ICreateBoardEndpointParams,
} from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, getNewId } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import SessionSelectors from "../../session/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";
import { defaultTo } from "lodash";
import { IStoreLikeObject } from "../../types";

export const createBoardOpAction = makeAsyncOp(
  "op/boards/createBoard",
  OperationType.CreateBoard,
  async (arg: ICreateBoardEndpointParams, thunkAPI, extras) => {
    let board: IBoard | null = null;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (extras.isDemoMode) {
      board = {
        customId: getNewId(),
        createdBy: user.customId,
        createdAt: getDateString(),
        type: BlockType.Board,
        rootBlockId: arg.board.parent,
        name: arg.board.name,
        description: arg.board.description,
        color: arg.board.color,
        parent: arg.board.parent,
        boardStatuses: defaultTo(arg.board.boardStatuses, []).map((item) => ({
          ...item,
          createdAt: getDateString(),
          createdBy: user.customId,
        })),
        boardLabels: defaultTo(arg.board.boardLabels, []).map((item) => ({
          ...item,
          createdAt: getDateString(),
          createdBy: user.customId,
        })),
        boardResolutions: defaultTo(arg.board.boardResolutions, []).map(
          (item) => ({
            ...item,
            createdAt: getDateString(),
            createdBy: user.customId,
          })
        ),
      };
    } else {
      const result = await BoardAPI.createBoard(arg);
      assertEndpointResult(result);
      board = result.board;
    }

    assert(board, messages.internalError);
    completeCreateBoard(thunkAPI, board);
    return board;
  }
);

export function completeCreateBoard(thunkAPI: IStoreLikeObject, board: IBoard) {
  thunkAPI.dispatch(
    BoardActions.add({
      id: board.customId,
      data: board,
    })
  );
}
