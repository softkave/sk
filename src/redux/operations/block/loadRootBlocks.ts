import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes
} from "../operation";
import { loadRootBlocksOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export default async function loadRootBlocksOperationFunc(
  dataProps: {} = {},
  options: IOperationFuncOptions = {}
) {
  const operation = getFirstOperationWithID(
    store.getState(),
    loadRootBlocksOperationID
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(loadRootBlocksOperationID, {
      scopeID: options.scopeID,
      status: operationStatusTypes.operationStarted,
      timestamp: Date.now()
    })
  );

  try {
    const result = await blockNet.getRootBlocks();

    if (result && result.errors) {
      throw result.errors;
    }

    const { blocks: rootBlocks } = result;

    store.dispatch(blockActions.bulkAddBlocksRedux(rootBlocks));
    store.dispatch(
      pushOperation(loadRootBlocksOperationID, {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationComplete,
        timestamp: Date.now()
      })
    );
  } catch (error) {
    // TODO: Only save the error, not OperationError
    const transformedError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(loadRootBlocksOperationID, {
        error: transformedError,
        scopeID: options.scopeID,
        status: operationStatusTypes.operationError,
        timestamp: Date.now()
      })
    );
  }
}
