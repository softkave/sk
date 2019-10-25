import randomColor from "randomcolor";
import { Dispatch } from "redux";
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
import { signupUserOperationID } from "../operationIDs";
import { getFirstOperationWithID, getOperationsWithID } from "../selectors";

export interface ISignupUserData {
  name: string;
  email: string;
  password: string;
}

export default async function signupUserOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: ISignupUserData
) {
  const operation = getFirstOperationWithID(state, signupUserOperationID);

  if (isOperationStarted(operation)) {
    return;
  }

  const data = { ...user, color: randomColor() };

  dispatchOperationStarted(dispatch, signupUserOperationID);

  try {
    const result = await userNet.signup({ user: data });

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(setRootView(makeOrgsView()));
      dispatch(loginUserRedux(result.token, result.user.customId));
    } else {
      throw anErrorOccurred;
    }

    dispatchOperationComplete(dispatch, signupUserOperationID);
  } catch (error) {
    const err = OperationError.fromAny(error).transform({
      stripBaseNames: ["user"]
    });

    dispatchOperationError(dispatch, signupUserOperationID, null, err);
  }
}
