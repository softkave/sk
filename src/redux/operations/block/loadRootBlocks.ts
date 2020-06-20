import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  OperationStatus,
} from "../operation";
import { OperationIds.loadRootBlocks } from "../opc";
import { getFirstOperationWithId } from "../selectors";

export default async function loadRootBlocksOperationFunc(
  dataProps: {} = {},
  options: IOperationFuncOptions = {}
) {
  const operation = getFirstOperationWithId(
    store.getState(),
    OperationIds.loadRootBlocks
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(OperationIds.loadRootBlocks, {
      scopeId: options.scopeId,
      status: OperationStatus.Started,
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
      pushOperation(OperationIds.loadRootBlocks, {
        scopeId: options.scopeId,
        status: OperationStatus.Completed,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    store.dispatch(
      pushOperation(OperationIds.loadRootBlocks, {
        error,
        scopeId: options.scopeId,
        status: OperationStatus.Error,
        timestamp: Date.now(),
      })
    );
  }
}
