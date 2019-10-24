import { Dispatch } from "redux";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import { anErrorOccurred } from "../../../utils/operation-error/OperationErrorItem";
import { loginUserRedux } from "../../session/actions";
import { IReduxState } from "../../store";
import { addUserRedux } from "../../users/actions";
import { pushView } from "../../view/actions";
import { makeOrgsView } from "../../view/orgs";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
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

export default async function loginUserOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: ILoginUserData
) {
  const operation = getFirstOperationWithID(state, loginUserOperationID);

  if (isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(dispatch, loginUserOperationID);

  try {
    const result = await userNet.login(user);

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(pushView(makeOrgsView()));
      dispatch(loginUserRedux(result.token, result.user.customId));
    } else {
      throw anErrorOccurred;
    }

    dispatchOperationComplete(dispatch, loginUserOperationID);
  } catch (error) {
    const err = OperationError.fromAny(error);

    dispatchOperationError(dispatch, loginUserOperationID, null, err);
  }
}
