import moment from "moment";
import { Dispatch } from "redux";

import { IBlock } from "../../../models/block/block";
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
import { updateBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function updateBlockOperation(
  state: IReduxState,
  dispatch: Dispatch,
  block: IBlock,
  data: Partial<IBlock>
) {
  const operation = getOperationWithIDForResource(
    state,
    updateBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  if (data.expectedEndAt && typeof data.expectedEndAt !== "number") {
    data.expectedEndAt = moment(data.expectedEndAt).valueOf();
  }

  dispatchOperationStarted(dispatch, updateBlockOperationID, block.customId);

  try {
    const result = await blockNet.updateBlock({ block, data });

    if (result && result.errors) {
      throw result.errors;
    }

    dispatch(
      blockActions.updateBlockRedux(block.customId, data, {
        arrayUpdateStrategy: "replace"
      })
    );

    dispatchOperationComplete(dispatch, updateBlockOperationID, block.customId);
  } catch (error) {
    const transformedError = transformError(error, {
      // filterBaseNames: ["block"],
      stripBaseNames: ["data"]
    });

    dispatchOperationError(
      dispatch,
      updateBlockOperationID,
      block.customId,
      transformedError
    );
  }
}
