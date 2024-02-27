import { defaultTo } from "lodash";
import BoardAPI, { IDeleteBoardEndpointParams } from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import SprintActions from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
import TaskActions from "../../tasks/actions";
import TaskSelectors from "../../tasks/selectors";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";

export const deleteBoardOpAction = makeAsyncOp02NoPersist(
  "op/boards/deleteBoard",
  async (arg: IDeleteBoardEndpointParams, thunkAPI, extras) => {
    if (!extras.isDemoMode) {
      const result = await BoardAPI.deleteBoard(arg);
      assertEndpointResult(result);
    }
    completeDeleteBoard(thunkAPI, arg.boardId);
  }
);

export function completeDeleteBoard(thunkAPI: IStoreLikeObject, boardId: string) {
  const board = BoardSelectors.getOne(thunkAPI.getState(), boardId);

  if (board) {
    const workspace = OrganizationSelectors.getOne(thunkAPI.getState(), board.workspaceId);
    if (workspace) {
      const boardIds = defaultTo(workspace?.boardIds, []).filter((id) => id !== board.customId);
      thunkAPI.dispatch(
        OrganizationActions.update({
          id: workspace.customId,
          data: { boardIds },
          meta: { arrayUpdateStrategy: "replace" },
        })
      );
    }
  }

  thunkAPI.dispatch(BoardActions.remove(boardId));
  deleteBoardTasks(thunkAPI, boardId);
  deleteBoardSprints(thunkAPI, boardId);
}

function deleteBoardTasks(thunkAPI: IStoreLikeObject, boardId: string) {
  const tasks = TaskSelectors.getBoardTasks(thunkAPI.getState(), boardId);
  thunkAPI.dispatch(TaskActions.bulkDelete(tasks.map((item) => item.customId)));
}

function deleteBoardSprints(thunkAPI: IStoreLikeObject, boardId: string) {
  const sprints = SprintSelectors.getBoardSprints(thunkAPI.getState(), boardId);
  thunkAPI.dispatch(SprintActions.bulkDeleteSprints(sprints.map((item) => item.customId)));
}
