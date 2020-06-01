import { Dispatch } from "redux";
import * as userNet from "../../../net/user";
import { IAppState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted,
} from "../operation";
import { requestForgotPasswordOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export interface IRequestForgotPasswordOperationFuncDataProps {
  email: string;
}

export default async function requestForgotPasswordOperationFunc(
  state: IAppState,
  dispatch: Dispatch,
  dataProps: IRequestForgotPasswordOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { email } = dataProps;
  const operation = getFirstOperationWithID(
    state,
    requestForgotPasswordOperationID
  );

  if (isOperationStarted(operation, options.scopeId)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationId: requestForgotPasswordOperationID,
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await userNet.forgotPassword(email);

    if (result && result.errors) {
      throw result.errors;
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    dispatchOperationError({ ...dispatchOptions, error });
  }
}
