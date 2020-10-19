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

export interface ILoadBlockChildrenOperationActionArgs {
    block: IBlock;
    typeList?: BlockType[];
}

export interface ILoadBlockChildrenOperationMeta {
    typeList?: BlockType[];
}

export const loadBlockChildrenOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ILoadBlockChildrenOperationActionArgs>,
    IAppAsyncThunkConfig
>("block/loadBlockChildren", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    await thunkAPI.dispatch(
        dispatchOperationStarted(
            id,
            OperationType.LoadBlockChildren,
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
        await thunkAPI.dispatch(BlockActions.bulkAddBlocks(blocks));

        const boards: string[] = [];

        blocks.forEach((nextBlock) => {
            if (nextBlock.type === BlockType.Board) {
                boards.push(nextBlock.customId);
            }
        });

        if (boards.length > 0) {
            await thunkAPI.dispatch(
                BlockActions.updateBlock({
                    id: arg.block.customId,
                    data: { boards },
                    meta: {
                        arrayUpdateStrategy: "replace",
                    },
                })
            );
        }

        await thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.LoadBlockChildren,
                arg.block.customId
            )
        );
    } catch (error) {
        await thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.LoadBlockChildren,
                error,
                arg.block.customId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
