import moment from "moment";
import { addCustomIDToSubTasks } from "../../../components/block/getNewBlock";
import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import { updateBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import { addTaskToUserIfAssigned } from "./getTasksAssignedToUser";
import {
  hasBlockParentChanged,
  transferBlockStateHelper,
} from "./transferBlock";

export interface IUpdateBlockOperationFuncDataProps {
  block: IBlock;
  data: Partial<IBlock>;
}

export default async function updateBlockOperationFunc(
  dataProps: IUpdateBlockOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block, data } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
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

  store.dispatch(
    pushOperation(
      updateBlockOperationID,
      {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now(),
      },
      block.customId
    )
  );

  try {
    const result = await blockNet.updateBlock(block, data);

    if (result && result.errors) {
      throw result.errors;
    }

    addTaskToUserIfAssigned(block);
    const forTransferBlockOnly = { ...block, ...data };

    if (hasBlockParentChanged(block, forTransferBlockOnly)) {
      transferBlockStateHelper({
        draggedBlockID: forTransferBlockOnly.customId,
        sourceBlockID: block.parent!,
        destinationBlockID: data.parent!,
      });
    }

    store.dispatch(
      blockActions.updateBlockRedux(block.customId, data, {
        arrayUpdateStrategy: "replace",
      })
    );

    store.dispatch(
      pushOperation(
        updateBlockOperationID,
        {
          scopeID: options.scopeID,
          status: operationStatusTypes.operationComplete,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      stripBaseNames: ["data"],
    });

    store.dispatch(
      pushOperation(
        updateBlockOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: operationStatusTypes.operationError,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  }
}
