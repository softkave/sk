import { createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { addCustomIdToSubTasks } from "../../../components/block/getNewBlock";
import { BlockType, IBlock, IBlockStatus } from "../../../models/block/block";
import BlockAPI from "../../../net/block";
import { getDateString, newId } from "../../../utils/utils";
import BlockActions, { IUpdateBlockActionArgs } from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import {
  dispatchOperationCompleted,
  dispatchOperationError,
  dispatchOperationStarted,
  IOperation,
  isOperationStarted,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";
import {
  hasBlockParentChanged,
  transferBlockHelperAction,
} from "./transferBlock";

export interface IUpdateBlockOperationActionArgs {
  block: IBlock;
  data: Partial<IBlock>;
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
      const id = statuses[newIdIndex]?.customId;
      deletedStatuses[status.customId] = { newId: id };
    }
  });

  return deletedStatuses;
}

const updateTasksIfHasDeletedStatusesOrLabels = createAsyncThunk<
  void,
  GetOperationActionArgs<IUpdateBlockOperationActionArgs>,
  IAppAsyncThunkConfig
>("block/updateTasksIfHasDeletedStatusesOrLabels", async (args, thunkAPI) => {
  const deletedStatuses = getDeletedStatuses(
    args.block.boardStatuses,
    args.data.boardStatuses
  );
  const deletedLabels = getDeletedStatuses(
    args.block.boardLabels,
    args.data.boardLabels
  );
  const hasDeletedStatus = Object.keys(deletedStatuses).length > 0;
  const hasDeletedLabel = Object.keys(deletedLabels).length > 0;

  if (!hasDeletedStatus && !hasDeletedLabel) {
    return;
  }

  const tasks = BlockSelectors.getBlockChildren(
    thunkAPI.getState(),
    args.block,
    BlockType.Task
  );

  if (tasks.length === 0) {
    return;
  }

  const updates: IUpdateBlockActionArgs[] = [];
  const user = SessionSelectors.getSignedInUserRequired(thunkAPI.getState());

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
      updates.push({
        id: task.customId,
        data: taskUpdates,
        meta: { arrayUpdateStrategy: "replace" },
      });
    }
  });

  if (updates.length === 0) {
    return;
  }

  await thunkAPI.dispatch(BlockActions.bulkUpdateBlocks(updates));
});

export const updateBlockOperationAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<IUpdateBlockOperationActionArgs>,
  IAppAsyncThunkConfig
>("block/updateBlock", async (arg, thunkAPI) => {
  const id = arg.opId || newId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    id
  );

  if (isOperationStarted(operation)) {
    return;
  }

  await thunkAPI.dispatch(
    dispatchOperationStarted(id, OperationType.UpdateBlock, arg.block.customId)
  );

  try {
    if (arg.data.dueAt) {
      arg.data.dueAt = moment(arg.data.dueAt).toString();
    } else if (arg.data.type === BlockType.Task) {
      arg.data.subTasks = addCustomIdToSubTasks(arg.data.subTasks);
    }

    const result = await BlockAPI.updateBlock(arg.block, arg.data);

    if (result && result.errors) {
      throw result.errors;
    }

    // dispatch-type-error
    await thunkAPI.dispatch(completeUpdateBlock(arg) as any);
    await thunkAPI.dispatch(
      dispatchOperationCompleted(
        id,
        OperationType.UpdateBlock,
        arg.block.customId
      )
    );
  } catch (error) {
    await thunkAPI.dispatch(
      dispatchOperationError(
        id,
        OperationType.UpdateBlock,
        error,
        arg.block.customId
      )
    );
  }

  return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});

export const completeUpdateBlock = createAsyncThunk<
  void,
  IUpdateBlockOperationActionArgs,
  IAppAsyncThunkConfig
>("block/completeUpdateBlock", async (arg, thunkAPI) => {
  const forTransferBlockOnly = { ...arg.block, ...arg.data };

  if (hasBlockParentChanged(arg.block, forTransferBlockOnly)) {
    await thunkAPI.dispatch(
      transferBlockHelperAction({
        data: {
          draggedBlockId: forTransferBlockOnly.customId,
          destinationBlockId: arg.data.parent!,
        },
      }) as any
    );
  }

  await thunkAPI.dispatch(
    BlockActions.updateBlock({
      id: arg.block.customId,
      data: arg.data,
      meta: {
        arrayUpdateStrategy: "replace",
      },
    })
  );

  await thunkAPI.dispatch(updateTasksIfHasDeletedStatusesOrLabels(arg) as any);
});
