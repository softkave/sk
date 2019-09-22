import { Dispatch } from "redux";

import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import { IReduxState } from "../../store";
import { transformError } from "../error";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { loadRootBlocksOperationID } from "../operationIDs";
import { getOperationsWithID } from "../selectors";

export default async function loadRootBlocksOperation(
  state: IReduxState,
  dispatch: Dispatch
) {
  const operations = getOperationsWithID(state, loadRootBlocksOperationID);

  if (operations[0] && isOperationStarted(operations[0])) {
    return;
  }

  dispatchOperationStarted(dispatch, loadRootBlocksOperationID);

  try {
    const rootBlocks = await blockNet.getRoleBlocks();

    dispatch(blockActions.bulkAddBlocksRedux(rootBlocks));
    dispatchOperationComplete(dispatch, loadRootBlocksOperationID);
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      loadRootBlocksOperationID,
      null,
      transformedError
    );
  }
}
