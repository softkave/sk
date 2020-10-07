import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { IChat } from "../../../models/chat/types";
import ChatAPI, { ISendMessageAPIParameters } from "../../../net/chat";
import {
    getDateString,
    getNewId,
    getNewTempId,
    isTempId,
} from "../../../utils/utils";
import KeyValueActions from "../../key-value/actions";
import KeyValueSelectors from "../../key-value/selectors";
import { IQueuedChatsByRoomId, KeyValueKeys } from "../../key-value/types";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import OperationActions from "../actions";
import { IOperation, OperationStatus } from "../operation";
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
    void,
    GetOperationActionArgs<Required<ISendMessageAPIParameters>>,
    IAppAsyncThunkConfig
>("chat/sendMessage", async (arg, thunkAPI) => {
    const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    const isTempRoom = isTempId(arg.roomId);
    const chatTempId = getNewTempId();
    let chat: IChat = {
        customId: chatTempId,
        orgId: arg.orgId,
        message: arg.message,
        sender: user.customId,
        roomId: arg.roomId,
        createdAt: getDateString(),
        sending: true,
    };

    const firstChatOp = OperationSelectors.queryFilterOperation(
        thunkAPI.getState(),
        { type: OperationType.SendMessage }
    );

    const chatIndex = RoomSelectors.getRoomChatsCount(
        thunkAPI.getState(),
        arg.roomId,
        arg.recipientId
    );

    if (
        firstChatOp &&
        firstChatOp.status.status === OperationStatus.Pending &&
        !isDemoMode
    ) {
        const queuedChats =
            KeyValueSelectors.getKey<IQueuedChatsByRoomId>(
                thunkAPI.getState(),
                KeyValueKeys.QueuedChats
            ) || {};

        let roomQueuedChats = queuedChats[arg.roomId] || [];
        const tempChat = { ...chat, chatIndex };

        if (roomQueuedChats) {
            roomQueuedChats = roomQueuedChats.concat(tempChat);
        } else {
            roomQueuedChats = [tempChat];
        }

        thunkAPI.dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.QueuedChats,
                value: {
                    ...queuedChats,
                    [arg.roomId]: roomQueuedChats,
                },
            })
        );

        chat.queued = true;
        chat.sending = false;
        thunkAPI.dispatch(
            RoomActions.addChat({
                chat,
                recipientId: arg.recipientId,
                roomId: arg.roomId,
            })
        );

        return;
    }

    if (isTempRoom && !isDemoMode) {
        const opId = arg.opId || getNewId();
        const op = {
            id: opId,
            operationType: OperationType.SendMessage,
            status: {
                status: OperationStatus.Pending,
                timestamp: Date.now(),
            },
            resourceId: chat.customId,
        };

        thunkAPI.dispatch(OperationActions.pushOperation(op));
    }

    try {
        thunkAPI.dispatch(
            RoomActions.addChat({
                chat,
                recipientId: arg.recipientId,
                roomId: arg.roomId,
            })
        );

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
            chat.queued = false;
            thunkAPI.dispatch(
                RoomActions.updateChat({
                    chatIndex,
                    chatTempId,
                    roomTempId: isTempRoom ? arg.roomId : "",
                    id: chat.customId,
                    data: chat,
                    roomId: chat.roomId,
                })
            );
        } else {
            thunkAPI.dispatch(
                RoomActions.updateChat({
                    chatIndex,
                    chatTempId,
                    roomTempId: isTempRoom ? arg.roomId : "",
                    id: "",
                    data: {
                        sending: false,
                        queued: false,
                    },
                    roomId: isTempRoom ? "" : arg.roomId,
                })
            );
        }

        if (firstChatOp) {
            // TODO: should we delete or mark complete?
            thunkAPI.dispatch(OperationActions.deleteOperation(firstChatOp.id));
        }

        const queuedChats =
            KeyValueSelectors.getKey<IQueuedChatsByRoomId>(
                thunkAPI.getState(),
                KeyValueKeys.QueuedChats
            ) || {};

        const roomQueuedChats = queuedChats[arg.roomId];

        if (roomQueuedChats && roomQueuedChats.length > 0) {
            const updatedQueuedChats = { ...queuedChats };

            delete updatedQueuedChats[arg.roomId];
            thunkAPI.dispatch(
                KeyValueActions.setKey({
                    key: KeyValueKeys.QueuedChats,
                    value: updatedQueuedChats,
                })
            );

            thunkAPI.dispatch(
                sendQueuedMessageOperationAction({
                    chats: roomQueuedChats,
                    recipientId: arg.recipientId,
                    roomId: chat.roomId,
                }) as any
            );
        }
    } catch (error) {
        thunkAPI.dispatch(
            RoomActions.updateChat({
                chatIndex,
                chatTempId,
                roomTempId: isTempRoom ? arg.roomId : "",
                id: "",
                data: {
                    sending: false,
                    queued: false,
                    errorMessage: "Error sending message", // TODO: show original error message
                },
                roomId: isTempRoom ? "" : arg.roomId,
            })
        );

        const queuedChats =
            KeyValueSelectors.getKey<IQueuedChatsByRoomId>(
                thunkAPI.getState(),
                KeyValueKeys.QueuedChats
            ) || {};

        const roomQueuedChats = queuedChats[arg.roomId];

        if (roomQueuedChats && roomQueuedChats.length > 0) {
            const updatedQueuedChats = { ...queuedChats };

            delete updatedQueuedChats[arg.roomId];
            thunkAPI.dispatch(
                KeyValueActions.setKey({
                    key: KeyValueKeys.QueuedChats,
                    value: updatedQueuedChats,
                })
            );

            roomQueuedChats.forEach((tempChat) => {
                thunkAPI.dispatch(
                    RoomActions.updateChat({
                        chatIndex: tempChat.chatIndex,
                        chatTempId: tempChat.customId,
                        roomTempId: tempChat.roomId,
                        id: "",
                        data: {
                            sending: false,
                            queued: false,
                            errorMessage: "Error sending message", // TODO: show original error message
                        },
                        roomId: "",
                    })
                );
            });
        }
    }

    thunkAPI.dispatch(
        RoomActions.updateRoomReadCounter({
            userId: user.customId,
            roomId: chat.roomId,
            readCounter: getDateString(),
            isSignedInUser: true,
        })
    );
});

export const sendQueuedMessageOperationAction = createAsyncThunk<
    void,
    {
        chats: Array<IChat & { chatIndex: number }>;
        roomId: string;
        recipientId: string;
    },
    IAppAsyncThunkConfig
>("chat/sendQueuedMessage", async (arg, thunkAPI) => {
    arg.chats.forEach(async (tempChat) => {
        try {
            const result = await ChatAPI.sendMessage({
                message: tempChat.message,
                orgId: tempChat.orgId,
                recipientId: arg.recipientId,
                roomId: arg.roomId,
            });

            if (result && result.errors) {
                throw result.errors;
            }

            const chat = result.chat;
            chat.sending = false;
            chat.queued = false;
            thunkAPI.dispatch(
                RoomActions.updateChat({
                    chatTempId: tempChat.customId,
                    chatIndex: tempChat.chatIndex,
                    roomTempId: tempChat.roomId,
                    id: chat.customId,
                    data: chat,
                    roomId: chat.roomId,
                })
            );
        } catch (error) {
            thunkAPI.dispatch(
                RoomActions.updateChat({
                    chatIndex: tempChat.chatIndex,
                    chatTempId: tempChat.customId,
                    roomTempId: tempChat.roomId,
                    id: "",
                    data: {
                        sending: false,
                        queued: false,
                        errorMessage: "Error sending message", // TODO: show original error message
                    },
                    roomId: arg.roomId,
                })
            );
        }
    });
});
