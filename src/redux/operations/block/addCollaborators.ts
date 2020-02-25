import moment from "moment";
import { IAddCollaboratorFormItemValues } from "../../../components/collaborator/AddCollaboratorFormItem";
import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import { newId } from "../../../utils/utils";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes
} from "../operation";
import { addCollaboratorsOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface IAddCollaboratorOperationFuncDataProps {
  block: IBlock;

  // TODO: better declare type, don't rely on form values
  requests: IAddCollaboratorFormItemValues[];
  message?: string;
  expiresAt?: number | Date;
}

export default async function addCollaboratorsOperationFunc(
  dataProps: IAddCollaboratorOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block, requests, message, expiresAt } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
    addCollaboratorsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(
      addCollaboratorsOperationID,
      {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      block.customId
    )
  );

  try {
    const proccessedCollaborators = requests.map(request => {
      const requestExpiresAt = request.expiresAt || expiresAt;

      return {
        ...request,
        body: request.body || message!,
        expiresAt: requestExpiresAt
          ? moment(requestExpiresAt).valueOf()
          : undefined,
        customId: newId()
      };
    });

    const result = await blockNet.addCollaborators(
      block,
      proccessedCollaborators
    );

    if (result && result.errors) {
      throw result.errors;
    }

    const requestIds = proccessedCollaborators.map(request => request.customId);

    /**
     * Currently, the only the request IDs are stored, which will trigger a refetch of all the block's notifications
     * including the ones already fetched. The advantage to this, is that out-of-date notifications will be updated.
     *
     * TODO: When real-time data update is eventually implemented,
     * create the notifications from the request and store it here, and not rely on reloading all the data,
     * as updates will be pushed as they occur
     */
    // TODO: Block data loader is not reloading, look into why
    store.dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborationRequests: requestIds
        },
        { arrayUpdateStrategy: "concat" }
      )
    );

    store.dispatch(
      pushOperation(
        addCollaboratorsOperationID,
        {
          scopeID: options.scopeID,
          status: operationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      replaceBaseNames: [{ from: "collaborators", to: "requests" }]
    });

    store.dispatch(
      pushOperation(
        addCollaboratorsOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: operationStatusTypes.operationError,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  }
}
