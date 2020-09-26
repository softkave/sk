import { createAsyncThunk } from "@reduxjs/toolkit";
import ChatAPI, { IGetRoomsAPIParameters } from "../../../net/chat";
import { getNewId } from "../../../utils/utils";
import RoomActions from "../../rooms/actions";
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

export const getRoomsOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IGetRoomsAPIParameters>,
    IAppAsyncThunkConfig
>("chat/getRooms", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(dispatchOperationStarted(id, OperationType.GetRooms));

    try {
        const result = await ChatAPI.getRooms(arg);

        if (result && result.errors) {
            throw result.errors;
        }

        thunkAPI.dispatch(RoomActions.bulkAddRooms(result.rooms));
        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.GetRooms)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(id, OperationType.GetRooms, error)
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
