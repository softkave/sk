import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import * as notificationActions from "../../notifications/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  defaultOperationStatusTypes,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { getBlockCollaborationRequestsOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface ILoadBlockCollaborationRequestsOperationFuncDataProps {
  block: IBlock;
}

export default async function loadBlockCollaborationRequestsOperationFunc(
  dataProps: ILoadBlockCollaborationRequestsOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
    getBlockCollaborationRequestsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(
      getBlockCollaborationRequestsOperationID,
      {
        scopeID: options.scopeID,
        status: defaultOperationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      options.resourceID
    )
  );

  try {
    const result = await blockNet.getCollabRequests({ block });

    if (result && result.errors) {
      throw result.errors;
    }

    const { requests } = result;
    const ids = requests.map(request => request.customId);
    store.dispatch(notificationActions.bulkAddNotificationsRedux(requests));
    store.dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborationRequests: ids
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(
        getBlockCollaborationRequestsOperationID,
        {
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        options.resourceID
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(
        getBlockCollaborationRequestsOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        options.resourceID
      )
    );
  }
}
