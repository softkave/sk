import { Dispatch } from "redux";

import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import * as notificationActions from "../../notifications/actions";
import { IReduxState } from "../../store";
import { transformError } from "../error";
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

  dispatchOperationStarted(dispatch, getBlockCollaborationRequestsOperationID);

  try {
    const result = await blockNet.getCollabRequests({ block });

    if (result.errors) {
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
      getBlockCollaborationRequestsOperationID
    );
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      getBlockCollaborationRequestsOperationID,
      null,
      transformedError
    );
  }
}