import { createAsyncThunk } from "@reduxjs/toolkit";
import UserAPI from "../../../net/user";
import UserSessionStorageFuncs from "../../../storage/userSession";
import { newId } from "../../../utils/utils";
import SessionActions from "../../session/actions";
import { IAppAsyncThunkConfig } from "../../types";
import UserActions from "../../users/actions";
import {
  dispatchOperationCompleted,
  dispatchOperationError,
  dispatchOperationStarted,
  IOperation,
  isOperationStarted,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export interface ILoginUserOperationActionArgs {
  email: string;
  password: string;
  remember: boolean;
}

export const loginUserOperationAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<ILoginUserOperationActionArgs>,
  IAppAsyncThunkConfig
>("session/logoutUser", async (arg, thunkAPI) => {
  const id = arg.opId || newId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    id
  );

  if (isOperationStarted(operation)) {
    return;
  }

  await thunkAPI.dispatch(
    dispatchOperationStarted(id, OperationType.LoginUser)
  );

  try {
    // TODO: define types for the result
    const result = await UserAPI.login(arg.email, arg.password);

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      await thunkAPI.dispatch(UserActions.addUser(result.user));
      await thunkAPI.dispatch(
        SessionActions.loginUser({
          token: result.token,
          userId: result.user.customId,
        })
      );

      if (arg.remember) {
        UserSessionStorageFuncs.saveUserToken(result.token);
      }
    } else {
      throw new Error("An error occurred");
    }

    await thunkAPI.dispatch(
      dispatchOperationCompleted(id, OperationType.LoginUser)
    );
  } catch (error) {
    await thunkAPI.dispatch(
      dispatchOperationError(id, OperationType.LoginUser, error)
    );
  }

  return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
