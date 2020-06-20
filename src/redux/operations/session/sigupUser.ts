import randomColor from "randomcolor";
import { Dispatch } from "redux";
import * as userNet from "../../../net/user";
import { saveUserTokenToStorage } from "../../../storage/userSession";
import { loginUserRedux } from "../../session/actions";
import { IAppState } from "../../store";
import { addUserRedux } from "../../users/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted,
} from "../operation";
import { OperationIds.signupUser } from "../operationIDs";
import { getFirstOperationWithId } from "../selectors";

export interface ISignupUserData {
  name: string;
  email: string;
  password: string;
}

export interface ISignupUserOperationFuncDataProps {
  user: ISignupUserData;
}

export default async function signupUserOperationFunc(
  state: IAppState,
  dispatch: Dispatch,
  dataProps: ISignupUserOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user } = dataProps;
  const operation = getFirstOperationWithId(state, OperationIds.signupUser);

  if (isOperationStarted(operation, options.scopeId)) {
    return;
  }

  const data = { ...user, color: randomColor() };

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationId: OperationIds.signupUser,
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await userNet.signup(data as any);

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(loginUserRedux(result.token, result.user.customId));

      // TODO: should we save the user token after signup or only after login?
      saveUserTokenToStorage(result.token);
    } else {
      throw new Error("An error occurred");
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    dispatchOperationError({ ...dispatchOptions, error });
  }
}
