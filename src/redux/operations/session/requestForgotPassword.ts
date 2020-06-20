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
import { OperationIds.requestForgotPassword } from "../opc";
import { getFirstOperationWithId } from "../selectors";

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
  const operation = getFirstOperationWithId(
    state,
    OperationIds.requestForgotPassword
  );

  if (isOperationStarted(operation, options.scopeId)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationId: OperationIds.requestForgotPassword,
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
