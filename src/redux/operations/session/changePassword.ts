import { Dispatch } from "redux";
import { userErrorMessages } from "../../../models/user/userErrorMessages";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import { anErrorOccurred } from "../../../utils/operation-error/OperationErrorItem";
import { loginUserRedux } from "../../session/actions";
import { IReduxState } from "../../store";
import { addUserRedux } from "../../users/actions";
import { setRootView } from "../../view/actions";
import { makeOrgsView } from "../../view/orgs";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { changePasswordOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export interface IChangePasswordData {
  // email: string;
  password: string;
  token?: string;
}

export default async function changePasswordOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IChangePasswordData
) {
  if (!user.token) {
    dispatchOperationError(
      dispatch,
      changePasswordOperationID,
      null,
      OperationError.fromAny(new Error(userErrorMessages.invalidCredentials))
    );

    return;
  }

  const operation = getFirstOperationWithID(state, changePasswordOperationID);

  if (isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(dispatch, changePasswordOperationID);

  try {
    // TODO: Change type
    let result: any = null;

    if (user.token) {
      result = await userNet.changePasswordWithToken({
        password: user.password,
        token: user.token
      });
    } else {
      result = await userNet.changePassword({
        password: user.password,
        token: user.token
      });
    }

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(setRootView(makeOrgsView()));
      dispatch(loginUserRedux(result.token, result.user.customId));
    } else {
      throw anErrorOccurred;
    }

    dispatchOperationComplete(dispatch, changePasswordOperationID);
  } catch (error) {
    const err = OperationError.fromAny(error);

    dispatchOperationError(dispatch, changePasswordOperationID, null, err);
  }
}
