import { getUserData } from "../../../net/user";
import {
  getUserTokenFromStorage,
  saveUserTokenToStorage
} from "../../../storage/userSession";
import OperationError from "../../../utils/operation-error/OperationError";
import { loginUserRedux, setSessionToWeb } from "../../session/actions";
import store from "../../store";
import { addUserRedux } from "../../users/actions";
import { setDefaultView } from "../../view/actions";
import { pushOperation } from "../actions";
import {
  defaultOperationStatusTypes,
  IOperationFuncOptions,
  isOperationStarted
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

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(initializeAppSessionOperationID, {
      scopeID: options.scopeID,
      status: defaultOperationStatusTypes.operationStarted,
      timestamp: Date.now()
    })
  );

  try {
    const token = getUserTokenFromStorage();

    if (token) {
      const result = await getUserData(token);

      if (result && result.errors) {
        throw result.errors;
      }

      const { user, token: userToken } = result;

      saveUserTokenToStorage(userToken);
      store.dispatch(addUserRedux(user));
      store.dispatch(setDefaultView());
      store.dispatch(loginUserRedux(userToken, user.customId));

      saveUserTokenToStorage(userToken);
    } else {
      store.dispatch(setSessionToWeb());
    }

    store.dispatch(
      pushOperation(initializeAppSessionOperationID, {
        scopeID: options.scopeID,
        status: defaultOperationStatusTypes.operationComplete,
        timestamp: Date.now()
      })
    );
  } catch (error) {
    store.dispatch(setSessionToWeb());
    const finalError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(initializeAppSessionOperationID, {
        error: finalError,
        scopeID: options.scopeID,
        status: defaultOperationStatusTypes.operationError,
        timestamp: Date.now()
      })
    );
  }
}
