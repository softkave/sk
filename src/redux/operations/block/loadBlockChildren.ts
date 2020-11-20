import { createAsyncThunk } from "@reduxjs/toolkit";
import { BlockType, IBlock } from "../../../models/block/block";
import BlockAPI from "../../../net/block/block";
import { getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
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

export interface ILoadBlockChildrenOpActionArgs {
    blockId: string;
    typeList?: BlockType[];
}

export interface ILoadBlockChildrenOpMeta {
    typeList?: BlockType[];
}

export const loadBlockChildrenOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ILoadBlockChildrenOpActionArgs>,
    IAppAsyncThunkConfig
>("op/block/loadBlockChildren", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            id,
            OperationType.LOAD_BLOCK_CHILDREN,
            arg.blockId,
            null,
            { typeList: arg.typeList }
        )
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let blocks: IBlock[] = [];

        if (!isDemoMode) {
            const result = await BlockAPI.getBlockChildren({
                blockId: arg.blockId,
                typeList: arg.typeList,
            });

            if (result && result.errors) {
                throw result.errors;
            }

            blocks = result.blocks || [];
        }

        const boards: string[] = [];

        thunkAPI.dispatch(BlockActions.bulkAddBlocks(blocks));
        blocks.forEach((nextBlock) => {
            if (nextBlock.type === BlockType.Board) {
                boards.push(nextBlock.customId);
            }
        });

        if (boards.length > 0) {
            thunkAPI.dispatch(
                BlockActions.updateBlock({
                    id: arg.blockId,
                    data: { boards },
                    meta: {
                        arrayUpdateStrategy: "replace",
                    },
                })
            );
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.LOAD_BLOCK_CHILDREN,
                arg.blockId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.LOAD_BLOCK_CHILDREN,
                error,
                arg.blockId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
