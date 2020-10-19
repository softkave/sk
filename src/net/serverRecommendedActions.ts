import { logoutUserOperationAction } from "../redux/operations/session/logoutUser";
import store from "../redux/store";
import { IAppError } from "./types";

export enum ServerRecommendedActions {
    LoginAgain = "login-again",
}

function getErrorsWithServerRecommendedActions(errors: IAppError[]) {
    return errors.filter((error) => {
        return !!error.action;
    });
}

const shouldLoginAgain = (error: IAppError) => {
    if (error.action === ServerRecommendedActions.LoginAgain) {
        return true;
    }

    return false;
};

export function processServerRecommendedActions(errors: IAppError[]) {
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
