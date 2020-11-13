import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBlock } from "../../../models/block/block";
import { getRoomId } from "../../../models/rooms/utils";
import {
    fetchMissingBroadcasts,
    handleFetchMissingBroadcastsResponse,
} from "../../../net/socket/socket";
import { getNewId } from "../../../utils/utils";
import { ResourceType } from "../../key-value/types";
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

export interface IFetchBlockMissingBroadcastsOpActionArgs {
    block: IBlock;
}

export const fetchBlockMissingBroadcastsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IFetchBlockMissingBroadcastsOpActionArgs>,
    IAppAsyncThunkConfig
>("op/block/fetchBlockMissingBroadcasts", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    // TODO: should we return if client is currently fetching missing broadcasts
    // and how can we coordinate them?
    if (isOperationStarted(operation)) {
        return;
    }

    if (!arg.block.userLeftBlockAt) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            id,
            OperationType.FETCH_BLOCK_BROADCASTS,
            arg.block.customId
        )
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await fetchMissingBroadcasts(
                arg.block.userLeftBlockAt,
                [
                    getRoomId({
                        type: arg.block.type as ResourceType,
                        customId: arg.block.customId,
                    }),
                ]
            );

            // TODO: handle errors
            // if (result && result.errors) {
            //     throw result.errors;
            // }

            handleFetchMissingBroadcastsResponse(result);
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.FETCH_BLOCK_BROADCASTS,
                arg.block.customId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.FETCH_BLOCK_BROADCASTS,
                error,
                arg.block.customId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
