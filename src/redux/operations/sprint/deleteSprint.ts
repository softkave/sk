import { IBoard } from "../../../models/board/types";
import SprintAPI from "../../../net/sprint/sprint";
import { assertEndpointResult } from "../../../net/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import SprintActions, { IUpdateSprintActionArgs } from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
import store from "../../store";
import TaskActions from "../../tasks/actions";
import TaskSelectors from "../../tasks/selectors";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";

export const deleteSprintOpAction = makeAsyncOp02NoPersist(
  "op/sprint/deleteSprint",
  async (arg: { sprintId: string }, thunkAPI, extras) => {
    const isDemoMode = extras.isDemoMode;
    if (!isDemoMode) {
      const result = await SprintAPI.deleteSprint(arg.sprintId);
      assertEndpointResult(result);
    }

    completeDeleteSprint(thunkAPI, arg.sprintId);
  }
);

export function completeDeleteSprint(thunkAPI: IStoreLikeObject, sprintId: string) {
  const boardUpdates: Partial<IBoard> = {};
  const sprint = SprintSelectors.getSprint(thunkAPI.getState(), sprintId);
  if (!sprint) {
    return;
  }

  const board = BoardSelectors.assertGetOne(thunkAPI.getState(), sprint.boardId);
  if (sprint.customId === board.lastSprintId) {
    boardUpdates.lastSprintId = sprint.prevSprintId;
  }

  if (Object.keys(boardUpdates).length > 0) {
    // If has board updates
    store.dispatch(
      BoardActions.update({
        id: board.customId,
        data: boardUpdates,
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  }

  const tasks = TaskSelectors.getSprintTasks(store.getState(), sprint.customId);
  store.dispatch(
    TaskActions.bulkUpdate(
      tasks.map((task) => {
        return {
          id: task.customId,
          data: { taskSprint: null },
          meta: { arrayUpdateStrategy: "replace" },
        };
      })
    )
  );

  const bulkSprintUpdates: IUpdateSprintActionArgs[] = [];
  if (sprint.prevSprintId) {
    bulkSprintUpdates.push({
      id: sprint.prevSprintId,
      data: {
        nextSprintId: sprint.nextSprintId ?? undefined,
      },
    });
  }

  if (sprint.nextSprintId) {
    bulkSprintUpdates.push({
      id: sprint.nextSprintId,
      data: {
        prevSprintId: sprint.prevSprintId!,
      },
    });
  }

  store.dispatch(SprintActions.bulkUpdateSprints(bulkSprintUpdates));
  thunkAPI.dispatch(SprintActions.deleteSprint(sprintId));
}
