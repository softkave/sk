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

export interface IRequestForgotPasswordOperationFuncDataProps {
  email: string;
}

export default async function requestForgotPasswordOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IRequestForgotPasswordOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { email } = dataProps;
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
    const result = await userNet.forgotPassword({ email });

    if (result && result.errors) {
      throw result.errors;
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const err = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: err });
  }
}
