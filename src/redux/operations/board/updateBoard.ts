import assert from "assert";
import { defaultTo } from "lodash";
import {
  IBlockLabelInput,
  IBlockStatusInput,
  IBoardStatusResolutionInput,
  IUpdateBoardInput,
} from "../../../models/board/types";
import { getUpdateBoardInput } from "../../../models/board/utils";
import { messages } from "../../../models/messages";
import BoardAPI, {
  IUpdateBoardEndpointParams,
} from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, processComplexTypeInput } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import SessionSelectors from "../../session/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const updateBoardOpAction = makeAsyncOp(
  "op/boards/updateBoard",
  OperationType.UpdateBoard,
  async (
    arg: Omit<IUpdateBoardEndpointParams, "data"> & {
      data: Partial<
        Omit<
          IUpdateBoardInput,
          "boardStatuses" | "boardLabels" | "boardResolutions"
        > & {
          boardStatuses: IBlockStatusInput[];
          boardLabels: IBlockLabelInput[];
          boardResolutions: IBoardStatusResolutionInput[];
        }
      >;
    },
    thunkAPI,
    extras
  ) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    let board = BoardSelectors.assertGetOne(thunkAPI.getState(), arg.boardId);
    const updateBoardInput = getUpdateBoardInput(board, arg.data);

    if (extras.isDemoMode) {
      board = {
        ...board,
        updatedBy: user.customId,
        updatedAt: getDateString(),
        name: defaultTo(updateBoardInput.name, board.name),
        description: defaultTo(updateBoardInput.description, board.description),
        color: defaultTo(updateBoardInput.color, board.color),
        boardStatuses: updateBoardInput.boardStatuses
          ? processComplexTypeInput(
              board.boardStatuses,
              updateBoardInput.boardStatuses,
              "customId",
              (item) => ({
                ...item,
                createdAt: getDateString(),
                createdBy: user.customId,
              })
            )
          : board.boardStatuses,
        boardLabels: updateBoardInput.boardLabels
          ? processComplexTypeInput(
              board.boardLabels,
              updateBoardInput.boardLabels,
              "customId",
              (item) => ({
                ...item,
                createdAt: getDateString(),
                createdBy: user.customId,
              })
            )
          : board.boardLabels,
        boardResolutions: updateBoardInput.boardResolutions
          ? processComplexTypeInput(
              board.boardResolutions,
              updateBoardInput.boardResolutions,
              "customId",
              (item) => ({
                ...item,
                createdAt: getDateString(),
                createdBy: user.customId,
              })
            )
          : board.boardResolutions,
      };
    } else {
      const result = await BoardAPI.updateBoard({
        boardId: arg.boardId,
        data: updateBoardInput,
      });

      assertEndpointResult(result);
      board = result.board;
    }

    assert(board, messages.internalError);
    thunkAPI.dispatch(
      BoardActions.update({
        id: board.customId,
        data: board,
        meta: { arrayUpdateStrategy: "replace" },
      })
    );

    return board;
  },
  {
    preFn: (arg) => ({
      resourceId: arg.boardId,
    }),
  }
);
