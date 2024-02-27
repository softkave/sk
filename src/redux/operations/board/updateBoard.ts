import assert from "assert";
import { defaultTo } from "lodash";
import {
  IBoard,
  IBoardLabelInput,
  IBoardStatusInput,
  IBoardStatusResolutionInput,
  IUpdateBoardInput,
} from "../../../models/board/types";
import { getUpdateBoardInput } from "../../../models/board/utils";
import { appMessages } from "../../../models/messages";
import BoardAPI, { IUpdateBoardEndpointParams } from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, processComplexTypeInput } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import SessionSelectors from "../../session/selectors";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";

type ArgType = Omit<IUpdateBoardEndpointParams, "data"> & {
  data: Partial<
    Omit<IUpdateBoardInput, "boardStatuses" | "boardLabels" | "boardResolutions"> & {
      boardStatuses: IBoardStatusInput[];
      boardLabels: IBoardLabelInput[];
      boardResolutions: IBoardStatusResolutionInput[];
    }
  >;
};

export const updateBoardOpAction = makeAsyncOp02NoPersist(
  "op/boards/updateBoard",
  async (arg: ArgType, thunkAPI, extras) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    let board = BoardSelectors.assertGetOne(thunkAPI.getState(), arg.boardId);
    const updateBoardInput = getUpdateBoardInput(board, arg.data);
    if (extras.isDemoMode) {
      board = {
        ...board,
        lastUpdatedBy: user.customId,
        lastUpdatedAt: getDateString(),
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

      if (updateBoardInput.sprintOptions) {
        if (board.sprintOptions) {
          board.sprintOptions = {
            ...board.sprintOptions,
            ...updateBoardInput.sprintOptions,
            lastUpdatedAt: getDateString(),
            lastUpdatedBy: user.customId,
          };
        } else {
          board.sprintOptions = {
            ...updateBoardInput.sprintOptions,
            createdAt: getDateString(),
            createdBy: user.customId,
          };
        }
      }
    } else {
      const result = await BoardAPI.updateBoard({
        boardId: arg.boardId,
        data: updateBoardInput,
      });

      assertEndpointResult(result);
      board = result.board;
    }

    assert(board, appMessages.internalError);
    completeUpdateBoard(thunkAPI, board);
    return board;
  }
);

export function completeUpdateBoard(thunkAPI: IStoreLikeObject, board: IBoard) {
  thunkAPI.dispatch(
    BoardActions.update({
      id: board.customId,
      data: board,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}
