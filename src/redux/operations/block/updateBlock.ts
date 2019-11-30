import moment from "moment";
import { Dispatch } from "redux";
import { addCustomIDToSubTasks } from "../../../components/block/getNewBlock";
import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import { getBlock } from "../../blocks/selectors";
import { IReduxState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { updateBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import { addTaskToUserIfAssigned } from "./getTasksAssignedToUser";
import {
  hasBlockParentsChanged,
  transferBlockStateHelper
} from "./transferBlock";

export interface IUpdateBlockOperationFuncDataProps {
  block: IBlock;
  data: Partial<IBlock>;
}

export default async function updateBlockOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IUpdateBlockOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block, data } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    updateBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  if (data.expectedEndAt && typeof data.expectedEndAt !== "number") {
    data.expectedEndAt = moment(data.expectedEndAt).valueOf();
  } else if (data.type === "task") {
    data.subTasks = addCustomIDToSubTasks(data.subTasks);
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: updateBlockOperationID,
    resourceID: block.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.updateBlock({ block, data });

    if (result && result.errors) {
      throw result.errors;
    }

    addTaskToUserIfAssigned(block);
    const forTransferBlockOnly = { ...block, ...data };

    if (hasBlockParentsChanged(block, forTransferBlockOnly)) {
      const sourceBlock = getBlock(
        state,
        block.parents[block.parents.length - 1]
      );
      const destinationBlock = getBlock(
        state,
        forTransferBlockOnly.parents[forTransferBlockOnly.parents.length - 1]
      );

      if (sourceBlock && destinationBlock) {
        transferBlockStateHelper(state, dispatch, {
          sourceBlock,
          destinationBlock,
          draggedBlock: forTransferBlockOnly
        });
      }
    }

    dispatch(
      blockActions.updateBlockRedux(block.customId, data, {
        arrayUpdateStrategy: "replace"
      })
    );

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      stripBaseNames: ["data"]
    });

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
