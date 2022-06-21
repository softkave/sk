import { createAsyncThunk } from "@reduxjs/toolkit";
import UserAPI from "../../../net/user/user";
import { getNewId } from "../../../utils/utils";
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

export interface IRequestForgotPasswordOperationActionArgs {
  email: string;
}

export const requestForgotPasswordOpAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<IRequestForgotPasswordOperationActionArgs>,
  IAppAsyncThunkConfig
>("op/session/requestForgotPassword", async (arg, thunkAPI) => {
  const opId = arg.opId || getNewId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    opId
  );

  if (isOperationStarted(operation)) {
    return;
  }

  thunkAPI.dispatch(
    dispatchOperationStarted(opId, OperationType.RequestForgotPassword)
  );

  try {
    const result = await UserAPI.forgotPassword({ email: arg.email });

    if (result && result.errors) {
      throw result.errors;
    }

    thunkAPI.dispatch(
      dispatchOperationCompleted(opId, OperationType.RequestForgotPassword)
    );
  } catch (error) {
    thunkAPI.dispatch(
      dispatchOperationError(opId, OperationType.RequestForgotPassword, error)
    );
  }

  return wrapUpOpAction(thunkAPI, opId, arg);
});
