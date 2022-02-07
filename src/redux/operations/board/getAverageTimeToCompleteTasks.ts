import { createAsyncThunk } from "@reduxjs/toolkit";
import { getNewId, notImplementedYet } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
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

export const getAverageTimeToCompleteTasksOpAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<{ boardId: string }>,
  IAppAsyncThunkConfig
>("op/block/getAverageTimeToCompleteTasks", async (args, thunkAPI) => {
  const opId = args.opId || getNewId();
  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    opId
  );

  if (isOperationStarted(operation)) {
    return;
  }

  thunkAPI.dispatch(
    dispatchOperationStarted(
      opId,
      OperationType.GetAverageTimeToCompleteTasks,
      args.boardId
    )
  );

  try {
    const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
    let avg = 0;

    if (!isDemoMode) {
      notImplementedYet();
    }

    thunkAPI.dispatch(
      BoardActions.update({
        id: args.boardId,
        data: { avgTimeToCompleteTasks: avg },
        meta: { arrayUpdateStrategy: "replace" },
      })
    );

    thunkAPI.dispatch(
      dispatchOperationCompleted(
        opId,
        OperationType.GetAverageTimeToCompleteTasks,
        args.boardId
      )
    );
  } catch (error) {
    thunkAPI.dispatch(
      dispatchOperationError(
        opId,
        OperationType.GetAverageTimeToCompleteTasks,
        error,
        args.boardId
      )
    );
  }

  return wrapUpOpAction(thunkAPI, opId, args);
});
