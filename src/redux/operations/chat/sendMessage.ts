import { createAsyncThunk } from "@reduxjs/toolkit";
import { IChat, IRoom } from "../../../models/chat/types";
import ChatAPI, { ISendMessageAPIParameters } from "../../../net/chat";
import { getDateString, getNewId, getNewTempId } from "../../../utils/utils";
import ChatActions from "../../chats/actions";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
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

// tslint:disable-next-line: max-classes-per-file
export class NoRoomOrRecipientProvidedError extends Error {
    public name = "NoRoomOrRecipientProvidedError";
    public message =
        "A room or recipient must be provided when sending message";
}

// tslint:disable-next-line: max-classes-per-file
export class RoomDoesNotExistError extends Error {
    public name = "RoomDoesNotExistError";
    public message = "Room does not exist";
}

export const sendMessageOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ISendMessageAPIParameters>,
    IAppAsyncThunkConfig
>("chat/sendMessage", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    let room: IRoom;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (arg.roomId) {
        room = RoomSelectors.getRoom(thunkAPI.getState(), arg.roomId);
    } else if (arg.recipientId) {
        const tempId = getNewTempId();
        room = {
            customId: tempId,
            name: tempId,
            orgId: arg.orgId,
            createdAt: getDateString(),
            createdBy: user.customId,
            members: [
                { userId: user.customId, readCounter: getDateString() },
                { userId: arg.recipientId, readCounter: getDateString() },
            ],
        };
    } else {
        throw new NoRoomOrRecipientProvidedError();
    }

    let chat: IChat = {
        customId: getNewTempId(),
        orgId: arg.orgId,
        message: arg.message,
        sender: user.customId,
        roomId: room.customId,
        createdAt: getDateString(),
    };

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.SendMessage, chat.customId)
    );

    try {
        thunkAPI.dispatch(RoomActions.addRoom(room));
        thunkAPI.dispatch(ChatActions.addChat(chat));

        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await ChatAPI.sendMessage(arg);

            if (result && result.errors) {
                throw result.errors;
            }

            chat = result.chat;
            thunkAPI.dispatch(
                RoomActions.updateRoom({
                    id: room.customId,
                    data: {
                        customId: chat.roomId,
                    },
                })
            );

            thunkAPI.dispatch(
                ChatActions.updateChat({
                    id: chat.customId,
                    data: {
                        customId: chat.customId,
                    },
                })
            );
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.SendMessage,
                chat.customId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.SendMessage,
                error,
                chat.customId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
