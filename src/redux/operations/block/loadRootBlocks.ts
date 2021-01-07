import { createAsyncThunk } from "@reduxjs/toolkit";
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
    wrapUpOpAction,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { IOperationActionBaseArgs } from "../types";

export const loadRootBlocksOperationAction = createAsyncThunk<
    IOperation | undefined,
    IOperationActionBaseArgs,
    IAppAsyncThunkConfig
>("op/block/loadRootBlocks", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.LoadRootBlocks)
    );

    try {
        const result = await BlockAPI.getUserRootBlocks();

        if (result && result.errors) {
            throw result.errors;
        }

        thunkAPI.dispatch(BlockActions.bulkAddBlocks(result.blocks));
        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.LoadRootBlocks)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.LoadRootBlocks, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
