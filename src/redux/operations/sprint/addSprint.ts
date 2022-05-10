import { createAsyncThunk } from "@reduxjs/toolkit";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI, { IAddSprintAPIParams } from "../../../net/sprint/sprint";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, getNewId, getNewTempId } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import SessionSelectors from "../../session/selectors";
import SprintActions from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
import store from "../../store";
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

export const addSprintOpAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<IAddSprintAPIParams>,
  IAppAsyncThunkConfig
>("op/sprint/addSprint", async (arg, thunkAPI) => {
  const opId = arg.opId || getNewId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    opId
  );

  if (isOperationStarted(operation)) {
    return;
  }

  thunkAPI.dispatch(
    dispatchOperationStarted(opId, OperationType.AddSprint, arg.boardId)
  );

  try {
    let sprint: ISprint;
    const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
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
        customId: getNewTempId(),
        boardId: arg.boardId,
        orgId: board.rootBlockId!,
        duration: arg.data.duration,
        name: arg.data.name,
        createdAt: getDateString(),
        createdBy: user.customId,
        prevSprintId: board.lastSprintId,
      };
    }

    completeAddSprint(thunkAPI, sprint);
    thunkAPI.dispatch(
      dispatchOperationCompleted(opId, OperationType.AddSprint, arg.boardId)
    );
  } catch (error) {
    thunkAPI.dispatch(
      dispatchOperationError(opId, OperationType.AddSprint, error, arg.boardId)
    );
  }

  return wrapUpOpAction(thunkAPI, opId, arg);
});

export function completeAddSprint(thunkAPI: IStoreLikeObject, sprint: ISprint) {
  thunkAPI.dispatch(SprintActions.addSprint(sprint));
  const board = BoardSelectors.assertGetOne(
    thunkAPI.getState(),
    sprint.boardId
  );

  if (board.lastSprintId) {
    store.dispatch(
      SprintActions.updateSprint({
        id: board.lastSprintId,
        data: {
          nextSprintId: sprint.customId,
        },
      })
    );
  }

  store.dispatch(
    BoardActions.update({
      id: sprint.boardId,
      data: {
        lastSprintId: sprint.customId,
      },
    })
  );
}
