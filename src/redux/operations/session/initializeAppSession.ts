import { getUserData } from "../../../net/user";
import { getUserTokenFromStorage } from "../../../storage/userSession";
import { loginUserRedux, setSessionToWeb } from "../../session/actions";
import store from "../../store";
import { addUserRedux } from "../../users/actions";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  OperationStatus,
} from "../operation";
import { OperationIds.initializeAppSession } from "../operationIDs";
import { getFirstOperationWithId } from "../selectors";

export default async function initializeAppSessionOperationFunc(
  options: IOperationFuncOptions = {}
) {
  const state = store.getState();
  const operation = getFirstOperationWithId(
    state,
    OperationIds.initializeAppSession
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(OperationIds.initializeAppSession, {
      scopeId: options.scopeId,
      status: OperationStatus.Started,
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
      pushOperation(OperationIds.initializeAppSession, {
        scopeId: options.scopeId,
        status: OperationStatus.Completed,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    store.dispatch(setSessionToWeb());

    store.dispatch(
      pushOperation(OperationIds.initializeAppSession, {
        error,
        scopeId: options.scopeId,
        status: OperationStatus.Error,
        timestamp: Date.now(),
      })
    );
  }
}
