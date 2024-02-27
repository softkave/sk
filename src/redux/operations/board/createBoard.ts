import assert from "assert";
import { defaultTo, uniq } from "lodash";
import { IBoard } from "../../../models/board/types";
import { appMessages } from "../../../models/messages";
import BoardAPI, { ICreateBoardEndpointParams } from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getNewId } from "../../../utils/ids";
import { getDateString } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import SessionSelectors from "../../session/selectors";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";

export const createBoardOpAction = makeAsyncOp02NoPersist(
  "op/boards/createBoard",
  async (arg: ICreateBoardEndpointParams, thunkAPI, extras) => {
    let board: IBoard | null = null;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    if (extras.isDemoMode) {
      board = {
        customId: getNewId(),
        createdBy: user.customId,
        createdAt: getDateString(),
        workspaceId: arg.board.workspaceId,
        name: arg.board.name,
        description: arg.board.description,
        color: arg.board.color,
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
        boardResolutions: defaultTo(arg.board.boardResolutions, []).map((item) => ({
          ...item,
          createdAt: getDateString(),
          createdBy: user.customId,
        })),
        visibility: "organization",
      };
    } else {
      const result = await BoardAPI.createBoard(arg);
      assertEndpointResult(result);
      board = result.board;
    }

    assert(board, appMessages.internalError);
    completeCreateBoard(thunkAPI, board);
    return board;
  }
);

export function completeCreateBoard(thunkAPI: IStoreLikeObject, board: IBoard) {
  thunkAPI.dispatch(
    BoardActions.update({
      id: board.customId,
      data: board,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );

  const workspace = OrganizationSelectors.getOne(thunkAPI.getState(), board.workspaceId);
  if (workspace) {
    const boardIds = uniq([...defaultTo(workspace?.boardIds, []), board.customId]);
    thunkAPI.dispatch(
      OrganizationActions.update({
        id: workspace.customId,
        data: { boardIds },
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  }
}
