import moment from "moment";
import { addCustomIdToSubTasks } from "../../../components/block/getNewBlock";
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
import { updateBlockOperationId } from "../operationIds";
import { getOperationWithIdForResource } from "../selectors";
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
  const operation = getOperationWithIdForResource(
    store.getState(),
    updateBlockOperationId,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  if (data.dueAt) {
    data.dueAt = moment(data.dueAt).toString();
  } else if (data.type === "task") {
    data.subTasks = addCustomIdToSubTasks(data.subTasks);
  }

  store.dispatch(
    pushOperation(
      updateBlockOperationId,
      {
        scopeId: options.scopeId,
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

    const forTransferBlockOnly = { ...block, ...data };

    if (hasBlockParentChanged(block, forTransferBlockOnly)) {
      transferBlockStateHelper({
        data: {
          draggedBlockId: forTransferBlockOnly.customId,
          destinationBlockId: data.parent!,
        },
      });
    }

    store.dispatch(
      blockActions.updateBlockRedux(block.customId, data, {
        arrayUpdateStrategy: "replace",
      })
    );

    store.dispatch(
      pushOperation(
        updateBlockOperationId,
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
        updateBlockOperationId,
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
