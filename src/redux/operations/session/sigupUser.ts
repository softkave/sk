import randomColor from "randomcolor";
import { Dispatch } from "redux";
import * as userNet from "../../../net/user";
import { saveUserTokenToStorage } from "../../../storage/userSession";
import OperationError from "../../../utils/operation-error/OperationError";
import { anErrorOccurred } from "../../../utils/operation-error/OperationErrorItem";
import { loginUserRedux } from "../../session/actions";
import { IReduxState } from "../../store";
import { addUserRedux } from "../../users/actions";
import { setDefaultView } from "../../view/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { signupUserOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export interface ISignupUserData {
  name: string;
  email: string;
  password: string;
}

export interface ISignupUserOperationFuncDataProps {
  user: ISignupUserData;
}

export default async function signupUserOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: ISignupUserOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user } = dataProps;
  const operation = getFirstOperationWithID(state, signupUserOperationID);

  if (isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const data = { ...user, color: randomColor() };

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: signupUserOperationID
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await userNet.signup({ user: data });

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(setDefaultView());
      dispatch(loginUserRedux(result.token, result.user.customId));

      // TODO: should we save the user token after signup or only after login?
      saveUserTokenToStorage(result.token);
    } else {
      throw anErrorOccurred;
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const err = OperationError.fromAny(error).transform({
      stripBaseNames: ["user"]
    });

    dispatchOperationError({ ...dispatchOptions, error: err });
  }
}
