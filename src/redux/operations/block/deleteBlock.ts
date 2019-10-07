import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import { deleteBlockRedux } from "../../blocks/actions";
import { IReduxState } from "../../store";
import { transformError } from "../error";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { deleteBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function deleteBlockOperation(
  state: IReduxState,
  dispatch: Dispatch,
  block: IBlock
) {
  const operation = getOperationWithIDForResource(
    state,
    deleteBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(dispatch, deleteBlockOperationID, block.customId);

  try {
    const result = await blockNet.deleteBlock({ block });

    if (result && result.errors) {
      throw result.errors;
    }

    dispatch(deleteBlockRedux(block.customId));
    dispatchOperationComplete(dispatch, deleteBlockOperationID, block.customId);
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      deleteBlockOperationID,
      block.customId,
      transformedError
    );
  }
}
