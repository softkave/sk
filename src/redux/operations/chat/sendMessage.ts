import { createAsyncThunk } from "@reduxjs/toolkit";
import { IChat } from "../../../models/chat/types";
import ChatAPI, { ISendMessageAPIParameters } from "../../../net/chat";
import {
    getDateString,
    getNewId,
    getNewTempId,
    isTempId,
} from "../../../utils/utils";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import { IOperation, isOperationStarted, OperationStatus } from "../operation";
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
    GetOperationActionArgs<Required<ISendMessageAPIParameters>>,
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

    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    const isTempRoom = isTempId(arg.roomId);
    const chatTempId = getNewTempId();
    let chat: IChat = {
        customId: chatTempId,
        orgId: arg.orgId,
        message: arg.message,
        sender: user.customId,
        roomId: "",
        createdAt: getDateString(),
        sending: true,
    };

    const chatIndex = RoomSelectors.getRoomChatsCount(
        thunkAPI.getState(),
        arg.roomId,
        arg.recipientId
    );

    try {
        thunkAPI.dispatch(
            RoomActions.addChat({
                chat,
                recipientId: arg.recipientId,
                roomId: arg.roomId,
            })
        );

        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await ChatAPI.sendMessage({
                message: arg.message,
                orgId: arg.orgId,
                recipientId: arg.recipientId,
                roomId: isTempRoom ? undefined : arg.roomId,
            });

            if (result && result.errors) {
                throw result.errors;
            }

            chat = result.chat;
            chat.sending = false;
            thunkAPI.dispatch(
                RoomActions.updateChat({
                    chatIndex,
                    chatTempId,
                    roomTempId: isTempRoom ? arg.roomId : "",
                    id: result.chat.customId,
                    data: result.chat,
                    roomId: result.chat.roomId,
                })
            );
        }

        const op: IOperation = {
            id: "",
            operationType: OperationType.SendMessage,
            status: {
                status: OperationStatus.Completed,
                timestamp: Date.now(),
            },
            resourceId: chat.customId,
        };

        return op;
    } catch (error) {
        thunkAPI.dispatch(
            RoomActions.updateChat({
                chatIndex,
                chatTempId,
                roomTempId: isTempRoom ? arg.roomId : "",
                id: "",
                data: {
                    sending: false,
                    errorMessage: "Error sending message", // TODO: show original error message
                },
                roomId: "",
            })
        );

        const op: IOperation = {
            id: "",
            operationType: OperationType.SendMessage,
            status: {
                status: OperationStatus.Error,
                timestamp: Date.now(),
            },
            resourceId: chat.customId,
        };

        return op;
    }
});
