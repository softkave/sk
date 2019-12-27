import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import { bulkDeleteBlocksRedux, deleteBlockRedux } from "../../blocks/actions";
import { getEveryBlockChildrenInState } from "../../blocks/selectors";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  defaultOperationStatusTypes,
  IOperationFuncOptions,
  isOperationStarted
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
        status: defaultOperationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      block.customId
    )
  );

  try {
    const result = await blockNet.deleteBlock({ block });

    if (result && result.errors) {
      throw result.errors;
    }

    const blockChildren = getEveryBlockChildrenInState(store.getState(), block);
    store.dispatch(
      bulkDeleteBlocksRedux(blockChildren.map(child => child.customId))
    );
    removeTaskFromUserIfAssigned(block);
    store.dispatch(deleteBlockRedux(block.customId));

    store.dispatch(
      pushOperation(
        deleteBlockOperationID,
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
        deleteBlockOperationID,
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
