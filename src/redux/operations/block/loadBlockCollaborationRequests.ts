import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import * as notificationActions from "../../notifications/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import { getBlockCollaborationRequestsOperationID } from "../operationIDs";
import { getOperationWithIdForResource } from "../selectors";

export interface ILoadBlockCollaborationRequestsOperationFuncDataProps {
  block: IBlock;
}

export default async function loadBlockCollaborationRequestsOperationFunc(
  dataProps: ILoadBlockCollaborationRequestsOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block } = dataProps;
  const operation = getOperationWithIdForResource(
    store.getState(),
    getBlockCollaborationRequestsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(
      getBlockCollaborationRequestsOperationID,
      {
        scopeId: options.scopeId,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now(),
      },
      block.customId
    )
  );

  try {
    const result = await blockNet.getCollabRequests(block);

    if (result && result.errors) {
      throw result.errors;
    }

    const { requests } = result;
    const ids = requests.map((request) => request.customId);
    store.dispatch(notificationActions.bulkAddNotificationsRedux(requests));
    store.dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborationRequests: ids,
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(
        getBlockCollaborationRequestsOperationID,
        {
          scopeId: options.scopeId,
          status: operationStatusTypes.operationComplete,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  } catch (error) {
    store.dispatch(
      pushOperation(
        getBlockCollaborationRequestsOperationID,
        {
          error,
          scopeId: options.scopeId,
          status: operationStatusTypes.operationError,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  }
}
