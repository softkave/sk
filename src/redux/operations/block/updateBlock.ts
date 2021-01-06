import { createAsyncThunk } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import {
    BlockType,
    getUpdateBlockInput,
    IBlock,
    IBoardTaskResolution,
    IFormBlock,
} from "../../../models/block/block";
import { seedBlock } from "../../../models/seedDemoData";
import BlockAPI from "../../../net/block/block";
import { getDateString, getNewId } from "../../../utils/utils";
import BlockActions, { IUpdateBlockActionArgs } from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
import {
    dispatchOperationCompleted,
    dispatchOperationError,
    dispatchOperationStarted,
    IOperation,
    isOperationStarted,
    wrapUpOpAction,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";
import { hasBlockParentChanged, storeTransferBlock } from "./transferBlock";

export interface IUpdateBlockOperationActionArgs {
    blockId: string;
    data: Partial<IFormBlock>;
}

export const updateBlockOpAction = createAsyncThunk<
    IOperation<IBlock> | undefined,
    GetOperationActionArgs<IUpdateBlockOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/block/updateBlock", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.UPDATE_BLOCK)
    );

    try {
        const block = BlockSelectors.getBlock(thunkAPI.getState(), arg.blockId);
        console.log({ arg, block });
        assignUserToTaskOnUpdateStatus(thunkAPI, block, arg.data);

        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        const updateBlockInput = getUpdateBlockInput(block, arg.data);
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let updatedBlock: IBlock | null = null;

        if (!isDemoMode) {
            const result = await BlockAPI.updateBlock({
                blockId: arg.blockId,
                data: updateBlockInput,
            });

            if (result && result.errors) {
                throw result.errors;
            }

            updatedBlock = result.block;
        } else {
            updatedBlock = {
                ...block,
                ...seedBlock(user, merge(block, arg.data)),
            };
        }

        storeUpdateBlock(thunkAPI, block, updatedBlock);
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.UPDATE_BLOCK,
                null,
                updatedBlock
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.UPDATE_BLOCK, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export const storeUpdateBlock = (
    store: IStoreLikeObject,
    block: IBlock,
    data: Partial<IBlock>
) => {
    const forTransferBlockOnly = { ...block, ...data };

    if (hasBlockParentChanged(block, forTransferBlockOnly)) {
        storeTransferBlock(store, {
            draggedBlockId: forTransferBlockOnly.customId,
            destinationBlockId: data.parent!,
        });
    }

    store.dispatch(
        BlockActions.updateBlock({
            data,
            id: block.customId,
            meta: {
                arrayUpdateStrategy: "replace",
            },
        })
    );

    updateTasksIfHasDeletedStatusesOrLabels(store, block, data);
};

function assignUserToTaskOnUpdateStatus(
    store: IStoreLikeObject,
    block: IBlock,
    data: Partial<IFormBlock>
) {
    if (block.type !== BlockType.Task) {
        return;
    }

    if (data.status && data.status !== block.status) {
        const assignees = data.assignees || block.assignees || [];

        if (assignees.length === 0) {
            const user = SessionSelectors.assertGetUser(store.getState());

            data.assignees = [
                {
                    userId: user.customId,
                },
            ];
        }
    }
}

/**
 * We're using IBoardTaskResolution and not IBoardStatus,
 * cause it's the closest type to IBoardLabel and IBoardStatus
 * and it affords us to use the same function for all three types
 */

function indexStatuses(statuses: IBoardTaskResolution[]) {
    return statuses.reduce((accumulator, status) => {
        accumulator[status.customId] = status;
        return accumulator;
    }, {});
}

interface IDeletedStatuses {
    [key: string]: { newId: string };
}

function getDeletedStatuses(
    existingStatuses: IBoardTaskResolution[] = [],
    statuses: IBoardTaskResolution[] = []
) {
    if (
        !statuses ||
        !existingStatuses ||
        (statuses.length === 0 && existingStatuses.length === 0)
    ) {
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

const updateTasksIfHasDeletedStatusesOrLabels = (
    store: IStoreLikeObject,
    block: IBlock,
    data: Partial<IBlock>
) => {
    const deletedStatuses = getDeletedStatuses(
        block.boardStatuses,
        data.boardStatuses
    );

    const deletedLabels = getDeletedStatuses(
        block.boardLabels,
        data.boardLabels
    );

    const deletedResolutions = getDeletedStatuses(
        block.boardResolutions,
        data.boardResolutions
    );

    const hasDeletedStatus = Object.keys(deletedStatuses).length > 0;
    const hasDeletedLabel = Object.keys(deletedLabels).length > 0;
    const hasDeletedResolutions = Object.keys(deletedResolutions).length > 0;

    if (!hasDeletedStatus && !hasDeletedLabel && !hasDeletedResolutions) {
        return;
    }

    const tasks = BlockSelectors.getBlockChildren(
        store.getState(),
        block.customId,
        BlockType.Task
    );

    if (tasks.length === 0) {
        return;
    }

    const updates: IUpdateBlockActionArgs[] = [];
    const user = SessionSelectors.assertGetUser(store.getState());

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

        if (
            hasDeletedResolutions &&
            task.taskResolution &&
            !!deletedResolutions[task.taskResolution]
        ) {
            taskUpdates.taskResolution = null;
            updated = true;
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

    store.dispatch(BlockActions.bulkUpdateBlocks(updates));
};
