import { logoutUserOperationAction } from "../redux/operations/session/logoutUser";
import store from "../redux/store";
import { INetError } from "./types";

export enum ServerRecommendedActions {
  LoginAgain = "login-again",
}

function getErrorsWithServerRecommendedActions(errors: INetError[]) {
  return errors.filter((error) => {
    return !!error.action;
  });
}

const shouldLoginAgain = (error: INetError) => {
  if (error.action === ServerRecommendedActions.LoginAgain) {
    return true;
  }

  return false;
};

export function processServerRecommendedActions(errors: INetError[]) {
  const errorsWithActions = getErrorsWithServerRecommendedActions(errors);

  if (errorsWithActions.length === 0) {
    return true;
  }

  let result = true;

  errorsWithActions.forEach((error) => {
    if (shouldLoginAgain(error)) {
      store.dispatch(logoutUserOperationAction());
      result = false;
    }
  });

  return result;
}