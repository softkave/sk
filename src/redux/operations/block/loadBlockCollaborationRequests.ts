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
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { getBlockCollaborationRequestsOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface ILoadBlockCollaborationRequestsOperationFuncDataProps {
  block: IBlock;
}

export default async function loadBlockCollaborationRequestsOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: ILoadBlockCollaborationRequestsOperationFuncDataProps,
  options: IOperationFuncOptions
) {
  const { block } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    getBlockCollaborationRequestsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: getBlockCollaborationRequestsOperationID,
    resourceID: block.customId
  };

  dispatchOperationStarted(dispatchOptions);

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

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
