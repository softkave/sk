import { createAsyncThunk } from "@reduxjs/toolkit";
import ChatAPI, {
    IUpdateRoomReadCounterAPIParameters,
} from "../../../net/chat";
import { getDateString, getNewId } from "../../../utils/utils";
import RoomActions from "../../rooms/actions";
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

export const updateRoomReadCounterOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IUpdateRoomReadCounterAPIParameters>,
    IAppAsyncThunkConfig
>("chat/updateRoomReadCounter", async (arg, thunkAPI) => {
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
            OperationType.UpdateRoomReadCounter,
            arg.roomId
        )
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        arg.readCounter = arg.readCounter || getDateString();

        if (!isDemoMode) {
            const result = await ChatAPI.updateRoomReadCounter(arg);

            if (result && result.errors) {
                throw result.errors;
            }
        }

        const user = SessionSelectors.assertGetUser(thunkAPI.getState());

        thunkAPI.dispatch(
            RoomActions.updateRoomReadCounter({
                roomId: arg.roomId,
                userId: user.customId,
                readCounter: arg.readCounter,
                isSignedInUser: true,
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.UpdateRoomReadCounter,
                arg.roomId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.UpdateRoomReadCounter,
                error,
                arg.roomId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
