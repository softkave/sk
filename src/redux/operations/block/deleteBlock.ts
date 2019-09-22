import { Dispatch } from "redux";

import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
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

  dispatchOperationStarted(dispatch, deleteBlockOperationID);

  try {
    const result = await blockNet.deleteBlock({ block });

    if (result.errors) {
      throw result.errors;
    }

    dispatchOperationComplete(dispatch, deleteBlockOperationID);
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      deleteBlockOperationID,
      null,
      transformedError
    );
  }
}
