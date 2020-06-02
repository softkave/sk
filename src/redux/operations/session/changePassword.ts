import { Dispatch } from "redux";
import { userErrorMessages } from "../../../models/user/userErrorMessages";
import * as userNet from "../../../net/user";
import { loginUserRedux } from "../../session/actions";
import { IAppState } from "../../store";
import { addUserRedux } from "../../users/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IdispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted,
} from "../operation";
import { changePasswordOperationId } from "../operationIds";
import { getFirstOperationWithId } from "../selectors";
import { saveUserTokenIfAlreadySaved } from "./utils";

export interface IChangePasswordOperationFuncDataProps {
  // email: string;
  password: string;
  token?: string;
}

export default async function changePasswordOperationFunc(
  state: IAppState,
  dispatch: Dispatch,
  dataProps: IChangePasswordOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { password, token } = dataProps;
  const dispatchOptions: IdispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationId: changePasswordOperationId,
  };

  if (!token) {
    dispatchOperationError({
      ...dispatchOptions,
      error: new Error(userErrorMessages.invalidCredentials),
    });

    return;
  }

  const operation = getFirstOperationWithId(state, changePasswordOperationId);

  if (isOperationStarted(operation, options.scopeId)) {
    return;
  }

  dispatchOperationStarted(dispatchOptions);

  try {
    // TODO: define type
    let result: any = null;

    if (token) {
      result = await userNet.changePasswordWithToken(password, token);
    } else {
      result = await userNet.changePassword(password, token);
    }

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(loginUserRedux(result.token, result.user.customId));

      saveUserTokenIfAlreadySaved(result.token);
    } else {
      throw new Error("An error occurred");
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    dispatchOperationError({ ...dispatchOptions, error });
  }
}
