import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import {
  bulkDeleteBlocksRedux,
  deleteBlockRedux,
  updateBlockRedux
} from "../../blocks/actions";
import { getBlock, getEveryBlockChildrenInState } from "../../blocks/selectors";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes
} from "../operation";
import { deleteBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import { removeTaskFromUserIfAssigned } from "./getTasksAssignedToUser";

export interface IDeleteBlockOperationFuncDataProps {
  block: IBlock;
}

export default async function deleteBlockOperationFunc(
  dataProps: IDeleteBlockOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
    deleteBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(
      deleteBlockOperationID,
      {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      block.customId
    )
  );

  try {
    const result = await blockNet.deleteBlock(block);

    if (result && result.errors) {
      throw result.errors;
    }

    // TODO: find a more efficient way to do this
    const blockChildren = getEveryBlockChildrenInState(store.getState(), block);

    if (blockChildren.length > 0) {
      store.dispatch(
        bulkDeleteBlocksRedux(blockChildren.map(child => child.customId))
      );
    }

    const parentID = block.parent;

    if (parentID) {
      const parent = getBlock(store.getState(), parentID);

      if (parent) {
        const pluralType = `${block.type}s`;
        const container = parent[pluralType] || [];
        const parentUpdate = {
          [pluralType]: container.filter(id => id !== block.customId)
        };

        if (block.type === "group") {
          const groupTaskContext = parent.groupTaskContext || [];
          const groupProjectContext = parent.groupProjectContext || [];
          parentUpdate.groupTaskContext = groupTaskContext.filter(
            id => id !== block.customId
          );
          parentUpdate.groupProjectContext = groupProjectContext.filter(
            id => id !== block.customId
          );
        }

        store.dispatch(
          updateBlockRedux(parent.customId, parentUpdate, {
            arrayUpdateStrategy: "replace"
          })
        );
      }
    }

    removeTaskFromUserIfAssigned(block);
    store.dispatch(deleteBlockRedux(block.customId));

    store.dispatch(
      pushOperation(
        deleteBlockOperationID,
        {
          scopeID: options.scopeID,
          status: operationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(
        deleteBlockOperationID,
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
