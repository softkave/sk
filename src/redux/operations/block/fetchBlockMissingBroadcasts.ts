import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRoomId } from "../../../models/rooms/utils";
import handleFetchMissingBroadcastsEvent from "../../../net/socket/incoming/handleFetchMissingBroadcastsEvent";
import fetchMissingBroadcastsEvent from "../../../net/socket/outgoing/fetchMissingBroadcastsEvent";
import { getNewId } from "../../../utils/utils";
import BlockSelectors from "../../blocks/selectors";
import { ResourceType } from "../../key-value/types";
import SessionSelectors from "../../session/selectors";
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
import { GetOperationActionArgs } from "../types";

export interface IFetchBlockMissingBroadcastsOpActionArgs {
    blockId: string;
}

export const fetchBlockMissingBroadcastsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IFetchBlockMissingBroadcastsOpActionArgs>,
    IAppAsyncThunkConfig
>("op/block/fetchBlockMissingBroadcasts", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    // TODO: should we return if client is currently fetching missing broadcasts
    // and how can we coordinate them?
    if (isOperationStarted(operation)) {
        return;
    }

    const block = BlockSelectors.getBlock(thunkAPI.getState(), arg.blockId);

    if (!block.userLeftBlockAt) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            opId,
            OperationType.FetchBlockBroadcasts,
            block.customId
        )
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await fetchMissingBroadcastsEvent(
                block.userLeftBlockAt,
                [
                    getRoomId({
                        type: block.type as ResourceType,
                        customId: block.customId,
                    }),
                ]
            );

            if (result && result.errors) {
                throw result.errors;
            }

            handleFetchMissingBroadcastsEvent(thunkAPI, result);
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.FetchBlockBroadcasts)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.FetchBlockBroadcasts,
                error
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
