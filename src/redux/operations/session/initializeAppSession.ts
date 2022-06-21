import { createAsyncThunk } from "@reduxjs/toolkit";
import UserAPI from "../../../net/user/user";
import UserSessionStorageFuncs from "../../../storage/userSession";
import { getNewId } from "../../../utils/utils";
import SessionActions from "../../session/actions";
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
import { IOperationActionBaseArgs } from "../types";
import { completeUserLogin } from "./signupUser";

export const initializeAppSessionOpAction = createAsyncThunk<
  IOperation | undefined,
  IOperationActionBaseArgs,
  IAppAsyncThunkConfig
>("op/session/initializeAppSession", async (arg, thunkAPI) => {
  const opId = arg.opId || getNewId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    opId
  );

  if (isOperationStarted(operation)) {
    return;
  }

  thunkAPI.dispatch(
    dispatchOperationStarted(opId, OperationType.InitializeAppSession)
  );

  try {
    const token = UserSessionStorageFuncs.getUserToken();

    if (token) {
      const result = await UserAPI.getUserData({ token });

      if (result && result.errors) {
        throw result.errors;
      }

      completeUserLogin(thunkAPI, result, true);
    } else {
      thunkAPI.dispatch(SessionActions.setSessionToWeb());
    }

    thunkAPI.dispatch(
      dispatchOperationCompleted(opId, OperationType.InitializeAppSession)
    );
  } catch (error) {
    thunkAPI.dispatch(SessionActions.setSessionToWeb());
    thunkAPI.dispatch(
      dispatchOperationError(opId, OperationType.InitializeAppSession, error)
    );
  }

  return wrapUpOpAction(thunkAPI, opId, arg);
});
