import KeyValueActions from "../redux/key-value/actions";
import { KeyValueKeys } from "../redux/key-value/types";
import { logoutUserOpAction } from "../redux/operations/session/logoutUser";
import store from "../redux/store";
import { IAppError } from "../utils/errors";

export enum ServerRecommendedActions {
  LOGIN_AGAIN = "LOGIN_AGAIN",
  LOGOUT = "LOGOUT",
}

function getErrorsWithServerRecommendedActions(errors: IAppError[]) {
  return errors.filter((error) => {
    return !!error.action;
  });
}

const shouldLoginAgain = (error: IAppError) => {
  if (
    error.action === ServerRecommendedActions.LOGIN_AGAIN ||
    error.action === ServerRecommendedActions.LOGOUT
  ) {
    return true;
  }

  return false;
};

export function handleLoginAgainError() {
  store.dispatch(logoutUserOpAction());
  store.dispatch(
    KeyValueActions.setKey({
      key: KeyValueKeys.LoginAgain,
      value: true,
    })
  );
}

export function processServerRecommendedActions(errors: IAppError[]) {
  const errorsWithActions = getErrorsWithServerRecommendedActions(errors);
  if (errorsWithActions.length === 0) {
    return true;
  }

  let result = true;
  errorsWithActions.forEach((error) => {
    if (shouldLoginAgain(error)) {
      handleLoginAgainError();
      result = false;
    }
  });

  return result;
}
