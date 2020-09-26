import { createAsyncThunk } from "@reduxjs/toolkit";
import ChatAPI, { IGetMessagesAPIParameters } from "../../../net/chat";
import { getNewId } from "../../../utils/utils";
import ChatActions from "../../chats/actions";
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

export const getMessagesOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IGetMessagesAPIParameters>,
    IAppAsyncThunkConfig
>("chat/getMessages", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(dispatchOperationStarted(id, OperationType.GetMessages));

    try {
        const result = await ChatAPI.getMessages(arg);

        if (result && result.errors) {
            throw result.errors;
        }

        thunkAPI.dispatch(ChatActions.bulkAddChats(result.chats));
        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.GetMessages)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(id, OperationType.GetMessages, error)
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
