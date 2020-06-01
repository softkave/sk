import { getSessionDetails } from "../../../net/user";
import { setSessionDetails } from "../../session/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import OperationIDs from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export default async function getSessionDetailsOperationFunc(
  options: IOperationFuncOptions = {}
) {
  const state = store.getState();
  const operation = getFirstOperationWithID(
    state,
    OperationIDs.getSessionDetails
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(OperationIDs.getSessionDetails, {
      scopeId: options.scopeId,
      status: operationStatusTypes.operationStarted,
      timestamp: Date.now(),
    })
  );

  try {
    const result = await getSessionDetails(state.session.token!);

    if (result && result.errors) {
      throw result.errors;
    }

    store.dispatch(setSessionDetails(result));
    store.dispatch(
      pushOperation(OperationIDs.getSessionDetails, {
        scopeId: options.scopeId,
        status: operationStatusTypes.operationComplete,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    store.dispatch(
      pushOperation(OperationIDs.getSessionDetails, {
        error,
        scopeId: options.scopeId,
        status: operationStatusTypes.operationError,
        timestamp: Date.now(),
      })
    );
  }
}
