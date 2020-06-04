import moment from "moment";
import { addCustomIdToSubTasks } from "../../../components/block/getNewBlock";
import { IBlock, IBlockStatus } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import { getDateString } from "../../../utils/utils";
import * as blockActions from "../../blocks/actions";
import { getOrgTasks } from "../../blocks/selectors";
import { ICollectionUpdateItemPayload } from "../../collection";
import { getSignedInUserRequired } from "../../session/selectors";
import store from "../../store";
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

    updateTasksIfHasDeletedStatusesOrLabels(block, data);

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

function indexStatuses(statuses: IBlockStatus[]) {
  return statuses.reduce((accumulator, status) => {
    accumulator[status.customId] = status;
    return accumulator;
  }, {});
}

interface IDeletedStatuses {
  [key: string]: { newId: string };
}

function getDeletedStatuses(
  existingStatuses: IBlockStatus[] = [],
  statuses: IBlockStatus[] = []
) {
  if (statuses.length === 0 && existingStatuses.length === 0) {
    return {};
  }

  const deletedStatuses: IDeletedStatuses = {};
  const cachedStatuses = indexStatuses(statuses);

  existingStatuses.forEach((status, i) => {
    if (!cachedStatuses[status.customId]) {
      const newIdIndex = i >= statuses.length ? i - 1 : i;
      const newId = statuses[newIdIndex]?.customId;
      deletedStatuses[status.customId] = { newId };
    }
  });

  return deletedStatuses;
}

function updateTasksIfHasDeletedStatusesOrLabels(
  block: IBlock,
  data: Partial<IBlock>
) {
  const deletedStatuses = getDeletedStatuses(
    block.boardStatuses,
    data.boardStatuses
  );
  const deletedLabels = getDeletedStatuses(block.boardLabels, data.boardLabels);
  const hasDeletedStatus = Object.keys(deletedStatuses).length > 0;
  const hasDeletedLabel = Object.keys(deletedLabels).length > 0;

  console.log({
    deletedStatuses,
    deletedLabels,
    hasDeletedLabel,
    hasDeletedStatus,
  });

  if (!hasDeletedStatus && !hasDeletedLabel) {
    return;
  }

  const tasks = getOrgTasks(store.getState(), block);

  console.log({ tasks });

  if (tasks.length === 0) {
    return;
  }

  const updates: Array<ICollectionUpdateItemPayload<IBlock>> = [];
  const user = getSignedInUserRequired(store.getState());

  tasks.forEach((task) => {
    const taskUpdates: Partial<IBlock> = {};
    let updated = false;

    if (hasDeletedStatus && task.status && deletedStatuses[task.status]) {
      taskUpdates.status = deletedStatuses[task.status].newId;
      taskUpdates.statusAssignedAt = getDateString();
      taskUpdates.statusAssignedBy = user.customId;
      updated = true;
    }

    if (hasDeletedLabel) {
      const taskAssignedLabels = task.labels?.filter((label) => {
        if (deletedLabels[label.customId]) {
          return false;
        }

        return true;
      });

      if (taskAssignedLabels?.length !== task.labels?.length) {
        taskUpdates.labels = taskAssignedLabels;
        updated = true;
      }
    }

    if (updated) {
      updates.push({ id: task.customId, data: taskUpdates });
    }
  });

  console.log({ updates, deletedStatuses, deletedLabels });

  if (updates.length === 0) {
    return;
  }

  store.dispatch(
    blockActions.bulkUpdateBlocksRedux(updates, {
      arrayUpdateStrategy: "replace",
    })
  );
}
