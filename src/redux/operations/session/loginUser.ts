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
import { loginUserOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface ILoginUserData {
  email: string;
  password: string;

  // TODO: Move remember from userNet to here
  remember: boolean;
}

export default async function loginUserOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: ILoginUserData
) {
  const operation = getOperationWithIDForResource(
    state,
    loginUserOperationID,
    user.email
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(dispatch, loginUserOperationID, user.email);

  try {
    const result = await userNet.login(user);

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(loginUserRedux(result.token, result.user.customId));
    } else {
      throw anErrorOccurred;
    }

    dispatchOperationComplete(dispatch, loginUserOperationID, user.email);
  } catch (error) {
    const err = OperationError.fromAny(error);

    dispatchOperationError(dispatch, loginUserOperationID, user.email, err);
  }
}
