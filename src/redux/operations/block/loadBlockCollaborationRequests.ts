import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import * as notificationActions from "../../notifications/actions";
import { IReduxState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { getBlockCollaborationRequestsOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function loadBlockCollaborationRequestsOperation(
  state: IReduxState,
  dispatch: Dispatch,
  block: IBlock
) {
  const operation = getOperationWithIDForResource(
    state,
    getBlockCollaborationRequestsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(
    dispatch,
    getBlockCollaborationRequestsOperationID,
    block.customId
  );

  try {
    const result = await blockNet.getCollabRequests({ block });

    if (result && result.errors) {
      throw result.errors;
    }

    const { requests } = result;
    const ids = requests.map(request => request.customId);
    dispatch(notificationActions.bulkAddNotificationsRedux(requests));
    dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborationRequests: ids
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    dispatchOperationComplete(
      dispatch,
      getBlockCollaborationRequestsOperationID,
      block.customId
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);
    dispatchOperationError(
      dispatch,
      getBlockCollaborationRequestsOperationID,
      block.customId,
      transformedError
    );
  }
}
