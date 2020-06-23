import { createAsyncThunk } from "@reduxjs/toolkit";
import randomColor from "randomcolor";
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

export interface ISignupUserOperationActionArgs {
  name: string;
  email: string;
  password: string;
}

export const signupUserOperationAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<ISignupUserOperationActionArgs>,
  IAppAsyncThunkConfig
>("session/signupUser", async (arg, thunkAPI) => {
  const id = arg.opId || newId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    id
  );

  if (isOperationStarted(operation)) {
    return;
  }

  await thunkAPI.dispatch(
    dispatchOperationStarted(id, OperationType.SignupUser)
  );

  try {
    const data = { ...arg, color: randomColor() };
    const result = await UserAPI.signup(data);

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

      // TODO: should we save the user token after signup or only after login?
      UserSessionStorageFuncs.saveUserToken(result.token);
    } else {
      throw new Error("An error occurred");
    }

    await thunkAPI.dispatch(
      dispatchOperationCompleted(id, OperationType.SignupUser)
    );
  } catch (error) {
    await thunkAPI.dispatch(
      dispatchOperationError(id, OperationType.SignupUser, error)
    );
  }

  return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
