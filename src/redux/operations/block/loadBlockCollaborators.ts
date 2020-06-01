import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import * as userActions from "../../users/actions";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import { getBlockCollaboratorsOperationID } from "../operationIDs";
import { getOperationWithIdForResource } from "../selectors";

export interface ILoadBlockCollaboratorsOperationFuncDataProps {
  block: IBlock;
}

export default async function loadBlockCollaboratorsOperationFunc(
  dataProps: ILoadBlockCollaboratorsOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block } = dataProps;
  const operation = getOperationWithIdForResource(
    store.getState(),
    getBlockCollaboratorsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(
      getBlockCollaboratorsOperationID,
      {
        scopeId: options.scopeId,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now(),
      },
      block.customId
    )
  );

  try {
    const result = await blockNet.getCollaborators(block);

    if (result && result.errors) {
      throw result.errors;
    }

    const { collaborators } = result;
    const ids = collaborators.map((collaborator) => collaborator.customId);
    store.dispatch(userActions.bulkAddUsersRedux(collaborators));
    store.dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborators: ids,
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(
        getBlockCollaboratorsOperationID,
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
        getBlockCollaboratorsOperationID,
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
