import { Dispatch } from "redux";
import * as userNet from "../../../net/user";
import { saveUserTokenToStorage } from "../../../storage/userSession";
import OperationError from "../../../utils/operation-error/OperationError";
import { anErrorOccurred } from "../../../utils/operation-error/OperationErrorItem";
import { loginUserRedux } from "../../session/actions";
import { IReduxState } from "../../store";
import { addUserRedux } from "../../users/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { loginUserOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

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
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: ILoginUserOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user } = dataProps;
  const operation = getFirstOperationWithID(state, loginUserOperationID);

  if (isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: loginUserOperationID
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
      throw anErrorOccurred;
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const err = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: err });
  }
}
