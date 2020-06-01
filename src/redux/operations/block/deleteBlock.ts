import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import {
  bulkDeleteBlocksRedux,
  deleteBlockRedux,
  updateBlockRedux,
} from "../../blocks/actions";
import { getBlock, getEveryBlockChildrenInState } from "../../blocks/selectors";
import { getSignedInUserRequired } from "../../session/selectors";
import store from "../../store";
import * as userActions from "../../users/actions";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import { deleteBlockOperationID } from "../operationIDs";
import { getOperationWithIdForResource } from "../selectors";
import { removeTaskFromUserIfAssigned } from "./getTasksAssignedToUser";

export interface IDeleteBlockOperationFuncDataProps {
  block: IBlock;
}

export default async function deleteBlockOperationFunc(
  dataProps: IDeleteBlockOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block } = dataProps;
  const operation = getOperationWithIdForResource(
    store.getState(),
    deleteBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(
      deleteBlockOperationID,
      {
        scopeId: options.scopeId,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now(),
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
        bulkDeleteBlocksRedux(blockChildren.map((child) => child.customId))
      );
    }

    const parentID = block.parent;

    if (parentID) {
      const parent = getBlock(store.getState(), parentID);

      if (parent) {
        const pluralType = `${block.type}s`;
        const container = parent[pluralType] || [];
        const parentUpdate = {
          [pluralType]: container.filter((id) => id !== block.customId),
        };

        if (block.type === "group") {
          const groupTaskContext = parent.groupTaskContext || [];
          const groupProjectContext = parent.groupProjectContext || [];
          parentUpdate.groupTaskContext = groupTaskContext.filter(
            (id) => id !== block.customId
          );
          parentUpdate.groupProjectContext = groupProjectContext.filter(
            (id) => id !== block.customId
          );
        }

        store.dispatch(
          updateBlockRedux(parent.customId, parentUpdate, {
            arrayUpdateStrategy: "replace",
          })
        );
      }
    }

    const user = getSignedInUserRequired(store.getState());

    if (block.type === "org") {
      const orgIndex = user.orgs.indexOf(block.customId);
      const orgs = [...user.orgs];
      orgs.splice(orgIndex, 1);

      store.dispatch(
        userActions.updateUserRedux(
          user.customId,
          { orgs },
          { arrayUpdateStrategy: "replace" }
        )
      );
    }

    removeTaskFromUserIfAssigned(block);
    store.dispatch(deleteBlockRedux(block.customId));

    store.dispatch(
      pushOperation(
        deleteBlockOperationID,
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
        deleteBlockOperationID,
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
