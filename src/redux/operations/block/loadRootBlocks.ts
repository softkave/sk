import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import { loadRootBlocksOperationId } from "../operationIDs";
import { getFirstOperationWithId } from "../selectors";

export default async function loadRootBlocksOperationFunc(
  dataProps: {} = {},
  options: IOperationFuncOptions = {}
) {
  const operation = getFirstOperationWithId(
    store.getState(),
    loadRootBlocksOperationId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(loadRootBlocksOperationId, {
      scopeId: options.scopeId,
      status: operationStatusTypes.operationStarted,
      timestamp: Date.now(),
    })
  );

  try {
    const result = await blockNet.getUserRootBlocks();

    if (result && result.errors) {
      throw result.errors;
    }

    const { blocks: rootBlocks } = result;

    store.dispatch(blockActions.bulkAddBlocksRedux(rootBlocks));
    store.dispatch(
      pushOperation(loadRootBlocksOperationId, {
        scopeId: options.scopeId,
        status: operationStatusTypes.operationComplete,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    store.dispatch(
      pushOperation(loadRootBlocksOperationId, {
        error,
        scopeId: options.scopeId,
        status: operationStatusTypes.operationError,
        timestamp: Date.now(),
      })
    );
  }
}
