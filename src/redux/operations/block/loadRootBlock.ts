import { Dispatch } from "redux";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import { IReduxState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { loadRootBlocksOperationID } from "../operationIDs";
import { getOperationsWithID } from "../selectors";

export default async function loadRootBlocksOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: {},
  options: IOperationFuncOptions
) {
  const operations = getOperationsWithID(state, loadRootBlocksOperationID);

  if (operations[0] && isOperationStarted(operations[0], options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: loadRootBlocksOperationID
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.getRoleBlocks();

    if (result && result.errors) {
      throw result.errors;
    }

    const { blocks: rootBlocks } = result;
    dispatch(blockActions.bulkAddBlocksRedux(rootBlocks));
    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
