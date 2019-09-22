import moment from "moment";
import { Dispatch } from "redux";

import { IACFItemValue } from "../../../components/collaborator/ACFItem";
import { IBlock } from "../../../models/block/block";

import { newId } from "../../../utils/utils";
import * as blockActions from "../../blocks/actions";

import { IReduxState } from "../../store";
import { transformError } from "../error";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { addCollaboratorsOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function addCollaboratorsOperation(
  state: IReduxState,
  dispatch: Dispatch,
  block: IBlock,

  // TODO: This is wrong, better declare type
  requests: IACFItemValue[],
  message?: string,
  expiresAt?: number | Date
) {
  const operation = getOperationWithIDForResource(
    state,
    addCollaboratorsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(
    dispatch,
    addCollaboratorsOperationID,
    block.customId
  );

  try {
    const proccessedCollaborators = requests.map(request => {
      return {
        ...request,
        body: request.body || message!,
        expiresAt: moment(request.expiresAt || expiresAt).valueOf(),
        customId: newId()
      };
    });

    const requestIds = proccessedCollaborators.map(request => request.customId);

    /**
     * Currently, the only the request IDs are stored, which will trigger a refetch of all the block's notifications
     * including the ones already fetched. The advantage to this, is that out-of-date notifications will be updated.
     *
     * TODO: When real-time data update is eventually implemented,
     * create the notifications from the request and store it here, and not rely on reloading all the data,
     * as updates will be pushed as they occur
     */
    dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborationRequests: requestIds
        },
        { arrayUpdateStrategy: "concat" }
      )
    );

    dispatchOperationComplete(dispatch, addCollaboratorsOperationID);
  } catch (error) {
    const transformedError = transformError(error, {
      replaceBaseNames: [{ from: "collaborators", to: "requests" }]
    });

    dispatchOperationError(
      dispatch,
      addCollaboratorsOperationID,
      null,
      transformedError
    );
  }
}
