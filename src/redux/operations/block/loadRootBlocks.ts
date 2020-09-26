import { createAsyncThunk } from "@reduxjs/toolkit";
import BlockAPI from "../../../net/block";
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
import { IOperationActionBaseArgs } from "../types";

export const loadRootBlocksOperationAction = createAsyncThunk<
    IOperation | undefined,
    IOperationActionBaseArgs,
    IAppAsyncThunkConfig
>("session/loadRootBlocks", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    await thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.LoadRootBlocks)
    );

    try {
        const result = await BlockAPI.getUserRootBlocks();

        if (result && result.errors) {
            throw result.errors;
        }

        const { blocks: rootBlocks } = result;

        await thunkAPI.dispatch(BlockActions.bulkAddBlocks(rootBlocks));

        await thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.LoadRootBlocks)
        );
    } catch (error) {
        await thunkAPI.dispatch(
            dispatchOperationError(id, OperationType.LoadRootBlocks, error)
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
