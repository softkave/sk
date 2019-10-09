import randomColor from "randomcolor";
import { Dispatch } from "redux";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import OperationErrorItem, {
  anErrorOccurred
} from "../../../utils/operation-error/OperationErrorItem";
import { loginUserRedux } from "../../session/actions";
import { IReduxState } from "../../store";
import { addUserRedux } from "../../users/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted
} from "../operation";
import { signupUserOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

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
  const operation = getOperationWithIDForResource(
    state,
    signupUserOperationID,
    user.email
  );

  if (operation) {
    dispatchOperationError(
      dispatch,
      signupUserOperationID,
      user.email,
      new OperationError([
        new OperationErrorItem("error", "You've signed up already")
      ])
    );

    return;
  }

  const data = { ...user, color: randomColor() };

  dispatchOperationStarted(dispatch, signupUserOperationID, data.email);

  try {
    const result = await userNet.signup({ user: data });

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(loginUserRedux(result.token, result.user.customId));
    } else {
      throw anErrorOccurred;
    }

    dispatchOperationComplete(dispatch, signupUserOperationID, data.email);
  } catch (error) {
    const err = OperationError.fromAny(error).transform({
      stripBaseNames: ["user"]
    });

    dispatchOperationError(dispatch, signupUserOperationID, data.email, err);
  }
}
