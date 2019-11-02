import { Dispatch } from "redux";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import { IReduxState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { requestForgotPasswordOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export interface IForgotPasswordData {
  email: string;
}

export interface IRequestForgotPasswordOperationFuncDataProps {
  user: IForgotPasswordData;
}

export default async function requestForgotPasswordOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IRequestForgotPasswordOperationFuncDataProps,
  options: IOperationFuncOptions
) {
  const { user } = dataProps;
  const operation = getFirstOperationWithID(
    state,
    requestForgotPasswordOperationID
  );

  if (isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: requestForgotPasswordOperationID
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await userNet.forgotPassword(user);

    if (result && result.errors) {
      throw result.errors;
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const err = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: err });
  }
}
