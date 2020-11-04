import { createAsyncThunk } from "@reduxjs/toolkit";
import { BlockType, IBlock } from "../../../models/block/block";
import BlockAPI from "../../../net/block/block";
import { getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
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
    block: IBlock;
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
            arg.block.customId,
            null,
            { typeList: arg.typeList }
        )
    );

    try {
        const result = await BlockAPI.getBlockChildren(arg.block, arg.typeList);

        if (result && result.errors) {
            throw result.errors;
        }

        const { blocks } = result;
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
                    id: arg.block.customId,
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
                arg.block.customId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.LOAD_BLOCK_CHILDREN,
                error,
                arg.block.customId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
