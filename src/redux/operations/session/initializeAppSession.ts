import { getUserData } from "../../../net/user";
import { getUserTokenFromStorage } from "../../../storage/userSession";
import { loginUserRedux, setSessionToWeb } from "../../session/actions";
import store from "../../store";
import { addUserRedux } from "../../users/actions";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import { initializeAppSessionOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export default async function initializeAppSessionOperationFunc(
  options: IOperationFuncOptions = {}
) {
  const state = store.getState();
  const operation = getFirstOperationWithID(
    state,
    initializeAppSessionOperationID
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(initializeAppSessionOperationID, {
      scopeId: options.scopeId,
      status: operationStatusTypes.operationStarted,
      timestamp: Date.now(),
    })
  );

  try {
    const token = getUserTokenFromStorage();

    if (token) {
      const result = await getUserData(token);

      if (result && result.errors) {
        throw result.errors;
      }

      const { user } = result;

      store.dispatch(addUserRedux(user));
      store.dispatch(loginUserRedux(token, user.customId));
    } else {
      store.dispatch(setSessionToWeb());
    }

    store.dispatch(
      pushOperation(initializeAppSessionOperationID, {
        scopeId: options.scopeId,
        status: operationStatusTypes.operationComplete,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    store.dispatch(setSessionToWeb());

    store.dispatch(
      pushOperation(initializeAppSessionOperationID, {
        error,
        scopeId: options.scopeId,
        status: operationStatusTypes.operationError,
        timestamp: Date.now(),
      })
    );
  }
}
