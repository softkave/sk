import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import * as userActions from "../../users/actions";
import { pushOperation } from "../actions";
import {
  defaultOperationStatusTypes,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { getBlockCollaboratorsOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface ILoadBlockCollaboratorsOperationFuncDataProps {
  block: IBlock;
}

export default async function loadBlockCollaboratorsOperationFunc(
  dataProps: ILoadBlockCollaboratorsOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
    getBlockCollaboratorsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(
      getBlockCollaboratorsOperationID,
      {
        scopeID: options.scopeID,
        status: defaultOperationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      block.customId
    )
  );

  try {
    const result = await blockNet.getCollaborators({ block });

    if (result && result.errors) {
      throw result.errors;
    }

    const { collaborators } = result;
    const ids = collaborators.map(collaborator => collaborator.customId);
    store.dispatch(userActions.bulkAddUsersRedux(collaborators));
    store.dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborators: ids
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(
        getBlockCollaboratorsOperationID,
        {
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(
        getBlockCollaboratorsOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationError,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  }
}
