import { Dispatch } from "redux";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import { IReduxState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { requestForgotPasswordOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface IForgotPasswordData {
  email: string;
}

export default async function requestForgotPasswordOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IForgotPasswordData
) {
  const operation = getOperationWithIDForResource(
    state,
    requestForgotPasswordOperationID,
    user.email
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(
    dispatch,
    requestForgotPasswordOperationID,
    user.email
  );

  try {
    const result = await userNet.forgotPassword(user);

    if (result && result.errors) {
      throw result.errors;
    }

    dispatchOperationComplete(
      dispatch,
      requestForgotPasswordOperationID,
      user.email
    );
  } catch (error) {
    const err = OperationError.fromAny(error);

    dispatchOperationError(
      dispatch,
      requestForgotPasswordOperationID,
      user.email,
      err
    );
  }
}
