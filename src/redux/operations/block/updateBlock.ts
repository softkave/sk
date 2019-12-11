import moment from "moment";
import { addCustomIDToSubTasks } from "../../../components/block/getNewBlock";
import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import { getBlock } from "../../blocks/selectors";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  defaultOperationStatusTypes,
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
        status: defaultOperationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      block.customId
    )
  );

  try {
    const result = await blockNet.updateBlock({ block, data });

    if (result && result.errors) {
      throw result.errors;
    }

    addTaskToUserIfAssigned(block);
    const forTransferBlockOnly = { ...block, ...data };

    if (hasBlockParentsChanged(block, forTransferBlockOnly)) {
      const sourceBlock = getBlock(
        store.getState(),
        block.parents[block.parents.length - 1]
      );
      const destinationBlock = getBlock(
        store.getState(),
        forTransferBlockOnly.parents[forTransferBlockOnly.parents.length - 1]
      );

      if (sourceBlock && destinationBlock) {
        transferBlockStateHelper({
          sourceBlock,
          destinationBlock,
          draggedBlock: forTransferBlockOnly
        });
      }
    }

    store.dispatch(
      blockActions.updateBlockRedux(block.customId, data, {
        arrayUpdateStrategy: "replace"
      })
    );

    store.dispatch(
      pushOperation(
        updateBlockOperationID,
        {
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      stripBaseNames: ["data"]
    });

    store.dispatch(
      pushOperation(
        updateBlockOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  }
}
