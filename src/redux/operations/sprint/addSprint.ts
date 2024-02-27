import { SystemResourceType } from "../../../models/app/types";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI, { IAddSprintAPIParams } from "../../../net/sprint/sprint";
import { assertEndpointResult } from "../../../net/utils";
import { getNewId02 } from "../../../utils/ids";
import { getDateString } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import SessionSelectors from "../../session/selectors";
import SprintActions from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
import store from "../../store";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";

export const addSprintOpAction = makeAsyncOp02NoPersist(
  "op/sprint/addSprint",
  async (arg: IAddSprintAPIParams, thunkAPI, extras) => {
    let sprint: ISprint;
    const isDemoMode = extras.isDemoMode;
    const board = BoardSelectors.assertGetOne(thunkAPI.getState(), arg.boardId);
    if (!isDemoMode) {
      const result = await SprintAPI.addSprint(arg);
      assertEndpointResult(result);
      sprint = result.sprint;
    } else {
      const user = SessionSelectors.assertGetUser(thunkAPI.getState());
      let sprintIndex: number;
      const prevSprint = board.lastSprintId
        ? SprintSelectors.getSprint(thunkAPI.getState(), board.lastSprintId)
        : null;

      if (prevSprint) {
        sprintIndex = prevSprint.sprintIndex + 1;
      } else {
        sprintIndex = 1;
      }

      sprint = {
        sprintIndex,
        customId: getNewId02(SystemResourceType.Temporary),
        boardId: arg.boardId,
        workspaceId: board.workspaceId,
        duration: arg.data.duration,
        name: arg.data.name,
        createdAt: getDateString(),
        createdBy: user.customId,
        prevSprintId: board.lastSprintId,
        visibility: "organization",
      };
    }

    completeAddSprint(thunkAPI, sprint);
  }
);

export function completeAddSprint(thunkAPI: IStoreLikeObject, sprint: ISprint) {
  thunkAPI.dispatch(SprintActions.addSprint(sprint));
  const board = BoardSelectors.assertGetOne(thunkAPI.getState(), sprint.boardId);
  if (board.lastSprintId) {
    store.dispatch(
      SprintActions.updateSprint({
        id: board.lastSprintId,
        data: { nextSprintId: sprint.customId },
      })
    );
  }

  store.dispatch(
    BoardActions.update({
      id: sprint.boardId,
      data: { lastSprintId: sprint.customId },
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}
