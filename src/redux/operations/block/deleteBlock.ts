import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import { bulkDeleteBlocksRedux, deleteBlockRedux } from "../../blocks/actions";
import { getEveryBlockChildrenInState } from "../../blocks/selectors";
import { IReduxState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { deleteBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import { removeTaskFromUserIfAssigned } from "./getTasksAssignedToUser";

export interface IDeleteBlockOperationFuncDataProps {
  block: IBlock;
}

export default async function deleteBlockOperation(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IDeleteBlockOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    deleteBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: deleteBlockOperationID,
    resourceID: block.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.deleteBlock({ block });

    if (result && result.errors) {
      throw result.errors;
    }

    const blockChildren = getEveryBlockChildrenInState(state, block);
    dispatch(bulkDeleteBlocksRedux(blockChildren.map(child => child.customId)));
    removeTaskFromUserIfAssigned(block);
    dispatch(deleteBlockRedux(block.customId));
    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
