import { createAsyncThunk } from "@reduxjs/toolkit";
import { BlockType } from "../../../models/block/block";
import BlockAPI from "../../../net/block/block";
import { getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
import UserActions from "../../users/actions";
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

export interface IDeleteBlockOperationActionArgs {
    blockId: string;
}

export const deleteBlockOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IDeleteBlockOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/block/deleteBlock", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.DELETE_BLOCK)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await BlockAPI.deleteBlock({ blockId: arg.blockId });

            if (result && result.errors) {
                throw result.errors;
            }
        }

        storeDeleteBlock(thunkAPI, arg.blockId);
        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.DELETE_BLOCK)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.DELETE_BLOCK, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export const storeDeleteBlock = (store: IStoreLikeObject, blockId: string) => {
    const block = BlockSelectors.getBlock(store.getState(), blockId);

    // TODO: find a more efficient way to do this
    const blockChildren = BlockSelectors.getBlockChildren(
        store.getState(),
        block.customId
    );

    if (blockChildren.length > 0) {
        store.dispatch(
            BlockActions.bulkDeleteBlocks(
                blockChildren.map((child) => child.customId)
            )
        );
    }

    const parentId = block.parent;

    if (parentId && block.type === BlockType.Board) {
        const parent = BlockSelectors.getBlock(store.getState(), parentId);

        if (parent) {
            const pluralType = `${block.type}s`;
            const container = parent[pluralType] || [];
            const parentUpdate = {
                [pluralType]: container.filter((id) => id !== block.customId),
            };

            store.dispatch(
                BlockActions.updateBlock({
                    id: parent.customId,
                    data: parentUpdate,
                    meta: {
                        arrayUpdateStrategy: "replace",
                    },
                })
            );
        }
    }

    const user = SessionSelectors.assertGetUser(store.getState());

    if (block.type === BlockType.Org) {
        const orgIndex = user.orgs.findIndex(
            (org) => org.customId === block.customId
        );

        const orgs = [...user.orgs];
        orgs.splice(orgIndex, 1);

        store.dispatch(
            UserActions.updateUser({
                id: user.customId,
                data: { orgs },
                meta: { arrayUpdateStrategy: "replace" },
            })
        );
    }

    store.dispatch(BlockActions.deleteBlock(block.customId));
};
