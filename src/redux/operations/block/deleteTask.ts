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
import { deleteTaskOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function deleteTaskOperation(
  state: IReduxState,
  dispatch: Dispatch,
  block: IBlock
) {
  const operation = getOperationWithIDForResource(
    state,
    deleteTaskOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(dispatch, deleteTaskOperationID);

  try {
    await blockNet.deleteBlock({ block });
    dispatchOperationComplete(dispatch, deleteTaskOperationID);
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      deleteTaskOperationID,
      null,
      transformedError
    );
  }
}
