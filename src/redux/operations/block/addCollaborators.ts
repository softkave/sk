import moment from "moment";
import { IBlock } from "../../../models/block/block";
import { IAddCollaboratorFormItemValues } from "../../../models/types";
import * as blockNet from "../../../net/block";
import { newId } from "../../../utils/utils";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import { addCollaboratorsOperationId } from "../operationIDs";
import { getOperationWithIdForResource } from "../selectors";

export interface IAddCollaboratorOperationFuncDataProps {
  block: IBlock;

  // TODO: better declare type, don't rely on form values
  collaborators: IAddCollaboratorFormItemValues[];
  message?: string;
  expiresAt?: number | Date;
}

export default async function addCollaboratorsOperationFunc(
  dataProps: IAddCollaboratorOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block, collaborators, message, expiresAt } = dataProps;
  const operation = getOperationWithIdForResource(
    store.getState(),
    addCollaboratorsOperationId,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(
      addCollaboratorsOperationId,
      {
        scopeId: options.scopeId,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now(),
      },
      block.customId
    )
  );

  try {
    const proccessedCollaborators = collaborators.map((request) => {
      const requestExpiresAt = request.expiresAt || expiresAt;

      return {
        ...request,
        body: request.body || message!,
        expiresAt: requestExpiresAt
          ? moment(requestExpiresAt).valueOf()
          : undefined,
        customId: newId(),
      };
    });

    const result = await blockNet.addCollaborators(
      block,
      proccessedCollaborators
    );

    if (result && result.errors) {
      throw result.errors;
    }

    // TODO
    // const requestIds = proccessedCollaborators.map(
    //   (request) => request.customId
    // );

    /**
     * Currently, the only the request Ids are stored, which will trigger a refetch of all the block's notifications
     * including the ones already fetched. The advantage to this, is that out-of-date notifications will be updated.
     *
     * TODO: When real-time data update is eventually implemented,
     * create the notifications from the request and store it here, and not rely on reloading all the data,
     * as updates will be pushed as they occur
     */
    // TODO: Block data loader is not reloading, look into why
    // store.dispatch(
    //   blockActions.updateBlockRedux(
    //     block.customId,
    //     {
    //       collaborationRequests: requestIds,
    //     },
    //     { arrayUpdateStrategy: "concat" }
    //   )
    // );

    store.dispatch(
      pushOperation(
        addCollaboratorsOperationId,
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
        addCollaboratorsOperationId,
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
