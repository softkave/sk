import { createAsyncThunk } from "@reduxjs/toolkit";
import SystemAPI, {
  ISendFeedbackEndpointParams,
} from "../../../net/system/api";
import { getNewId } from "../../../utils/utils";
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

export const sendFeedbackOpAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<ISendFeedbackEndpointParams>,
  IAppAsyncThunkConfig
>("op/system/sendFeedback", async (arg, thunkAPI) => {
  const opId = arg.opId || getNewId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    opId
  );

  if (isOperationStarted(operation)) {
    return;
  }

  thunkAPI.dispatch(dispatchOperationStarted(opId, OperationType.SendFeedback));

  try {
    const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

    if (!isDemoMode) {
      const result = await SystemAPI.sendFeedback({
        feedback: arg.feedback,
        description: arg.description,
        notifyEmail: arg.notifyEmail,
      });

      if (result && result.errors) {
        throw result.errors;
      }
    }

    thunkAPI.dispatch(
      dispatchOperationCompleted(opId, OperationType.SendFeedback)
    );
  } catch (error) {
    thunkAPI.dispatch(
      dispatchOperationError(opId, OperationType.SendFeedback, error)
    );
  }

  return wrapUpOpAction(thunkAPI, opId, arg);
});
