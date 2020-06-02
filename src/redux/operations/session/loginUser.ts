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
  IdispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted,
} from "../operation";
import { loginUserOperationId } from "../operationIds";
import { getFirstOperationWithId } from "../selectors";

export interface ILoginUserData {
  email: string;
  password: string;

  // TODO: Move remember from userNet to here
  remember: boolean;
}

export interface ILoginUserOperationFuncDataProps {
  user: ILoginUserData;
}

export default async function loginUserOperationFunc(
  state: IAppState,
  dispatch: Dispatch,
  dataProps: ILoginUserOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user } = dataProps;
  const operation = getFirstOperationWithId(state, loginUserOperationId);

  if (isOperationStarted(operation, options.scopeId)) {
    return;
  }

  const dispatchOptions: IdispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationId: loginUserOperationId,
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    // TODO: define types for the result
    const result = await userNet.login(user.email, user.password);

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(loginUserRedux(result.token, result.user.customId));

      if (user.remember) {
        saveUserTokenToStorage(result.token);
      }
    } else {
      throw new Error("An error occurred");
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    dispatchOperationError({ ...dispatchOptions, error });
  }
}
