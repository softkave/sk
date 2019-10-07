import { Dispatch } from "redux";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import { anErrorOccurred } from "../../../utils/operation-error/OperationErrorItem";
import { loginUserRedux } from "../../session/actions";
import { IReduxState } from "../../store";
import { addUserRedux } from "../../users/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { changePasswordOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface IChangePasswordData {
  email: string;
  password: string;
  token: string;
}

export default async function changePasswordOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IChangePasswordData
) {
  const operation = getOperationWithIDForResource(
    state,
    changePasswordOperationID,
    user.email
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(dispatch, changePasswordOperationID, user.email);

  try {
    const result = await userNet.changePassword({
      password: user.password,
      token: user.token
    });

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(loginUserRedux(result.token, result.user.customId));
    } else {
      throw anErrorOccurred;
    }

    dispatchOperationComplete(dispatch, changePasswordOperationID, user.email);
  } catch (error) {
    const err = OperationError.fromAny(error);

    dispatchOperationError(
      dispatch,
      changePasswordOperationID,
      user.email,
      err.errors
    );
  }
}
