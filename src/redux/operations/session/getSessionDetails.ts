import { getSessionDetails } from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import { setSessionDetails } from "../../session/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes
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

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(OperationIDs.getSessionDetails, {
      scopeID: options.scopeID,
      status: operationStatusTypes.operationStarted,
      timestamp: Date.now()
    })
  );

  try {
    const result = await getSessionDetails();

    if (result && result.errors) {
      throw result.errors;
    }

    setSessionDetails(result.details);
    store.dispatch(
      pushOperation(OperationIDs.getSessionDetails, {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationComplete,
        timestamp: Date.now()
      })
    );
  } catch (error) {
    const finalError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(OperationIDs.getSessionDetails, {
        error: finalError,
        scopeID: options.scopeID,
        status: operationStatusTypes.operationError,
        timestamp: Date.now()
      })
    );
  }
}
