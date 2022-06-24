import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBoard } from "../../../models/board/types";
import SprintAPI from "../../../net/sprint/sprint";
import { assertEndpointResult } from "../../../net/utils";
import { getNewId } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import SessionSelectors from "../../session/selectors";
import SprintActions, { IUpdateSprintActionArgs } from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
import store from "../../store";
import TaskActions from "../../tasks/actions";
import { getSprintTasks } from "../../tasks/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
import {
  dispatchOperationCompleted,
  dispatchOperationError,
  dispatchOperationStarted,
  IOperation,
  isOperationStarted,
  wrapUpOpAction,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export const deleteSprintOpAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<{ sprintId: string }>,
  IAppAsyncThunkConfig
>("op/sprint/deleteSprint", async (arg, thunkAPI) => {
  const opId = arg.opId || getNewId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    opId
  );

  if (isOperationStarted(operation)) {
    return;
  }

  thunkAPI.dispatch(
    dispatchOperationStarted(opId, OperationType.DeleteSprint, arg.sprintId)
  );

  try {
    const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

    if (!isDemoMode) {
      const result = await SprintAPI.deleteSprint(arg.sprintId);
      assertEndpointResult(result);
    }

    completeDeleteSprint(thunkAPI, arg.sprintId);
    thunkAPI.dispatch(
      dispatchOperationCompleted(opId, OperationType.DeleteSprint, arg.sprintId)
    );
  } catch (error) {
    thunkAPI.dispatch(
      dispatchOperationError(
        opId,
        OperationType.DeleteSprint,
        error,
        arg.sprintId
      )
    );
  }

  return wrapUpOpAction(thunkAPI, opId, arg);
});

export function completeDeleteSprint(
  thunkAPI: IStoreLikeObject,
  sprintId: string
) {
  const boardUpdates: Partial<IBoard> = {};
  const sprint = SprintSelectors.getSprint(thunkAPI.getState(), sprintId);
  if (!sprint) {
    return;
  }

  const board = BoardSelectors.assertGetOne(
    thunkAPI.getState(),
    sprint.boardId
  );

  if (sprint.customId === board.lastSprintId) {
    boardUpdates.lastSprintId = sprint.prevSprintId;
  }

  if (Object.keys(boardUpdates).length > 0) {
    // If has board updates
    store.dispatch(
      BoardActions.update({
        id: board.customId,
        data: boardUpdates,
      })
    );
  }

  const tasks = getSprintTasks(store.getState(), sprint.customId);
  store.dispatch(
    TaskActions.bulkUpdate(
      tasks.map((task) => {
        return {
          id: task.customId,
          data: {
            taskSprint: null,
          },
        };
      })
    )
  );

  const bulkSprintUpdates: IUpdateSprintActionArgs[] = [];

  if (sprint.prevSprintId) {
    bulkSprintUpdates.push({
      id: sprint.prevSprintId,
      data: {
        nextSprintId: sprint.nextSprintId || null,
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
