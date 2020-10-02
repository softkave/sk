import { createReducer } from "@reduxjs/toolkit";
import moment from "moment";
import { IChat } from "../../models/chat/types";
import { mergeData } from "../../utils/utils";
import { getRoomUserUnseenChatsCountAndStartIndex } from "../operations/chat/getUserRoomsAndChats";
import SessionActions from "../session/actions";
import RoomActions from "./actions";
import { IRoomsMap } from "./types";

const roomsReducer = createReducer<IRoomsMap>({}, (builder) => {
    builder.addCase(RoomActions.addRoom, (state, action) => {
        state[action.payload.customId] = action.payload;
    });

    builder.addCase(RoomActions.updateRoom, (state, action) => {
        const room = mergeData(
            state[action.payload.id],
            action.payload.data,
            action.payload.meta
        );

        state[room.customId] = room;
    });

    builder.addCase(RoomActions.deleteRoom, (state, action) => {
        delete state[action.payload];
    });

    builder.addCase(RoomActions.bulkAddRooms, (state, action) => {
        action.payload.forEach((room) => (state[room.customId] = room));
    });

    builder.addCase(RoomActions.bulkUpdateRooms, (state, action) => {
        action.payload.forEach((param) => {
            const room = mergeData(state[param.id], param.data, param.meta);
            state[room.customId] = room;
        });
    });

    builder.addCase(RoomActions.bulkDeleteRooms, (state, action) => {
        action.payload.forEach((id) => delete state[id]);
    });

    builder.addCase(RoomActions.updateRoomReadCounter, (state, action) => {
        const room = state[action.payload.roomId];

        if (!room) {
            return;
        }

        const memberData = room.members.find(
            (member) => member.userId === action.payload.userId
        );

        if (!memberData) {
            return;
        }

        memberData.readCounter = action.payload.readCounter;

        if (action.payload.isSignedInUser) {
            const {
                unseenChatsStartIndex,
            } = getRoomUserUnseenChatsCountAndStartIndex(
                room,
                moment(action.payload.readCounter)
            );

            room.unseenChatsStartIndex = unseenChatsStartIndex;
        }
    });

    builder.addCase(RoomActions.addChat, (state, action) => {
        let room = state[action.payload.roomId];

        if (!room) {
            const rmId = Object.keys(state).find((id) => {
                return state[id].recipientId === action.payload.recipientId;
            })!;
            room = state[rmId];
        }

        room.chats.push(action.payload.chat);
    });

    builder.addCase(RoomActions.updateChat, (state, action) => {
        const room =
            state[action.payload.roomId] || state[action.payload.roomTempId];
        let chat: IChat;

        if (
            action.payload.chatIndex &&
            action.payload.chatIndex < room.chats.length &&
            (room.chats[action.payload.chatIndex].customId ===
                action.payload.chatTempId ||
                room.chats[action.payload.chatIndex].customId ===
                    action.payload.id)
        ) {
            chat = room.chats[action.payload.chatIndex];
        } else {
            // Reverse search because we most likely are trying to update the latest chat entry id
            for (let i = room.chats.length - 1; i >= 0; i--) {
                const ch = room.chats[i];

                if (
                    ch.customId === action.payload.chatTempId ||
                    ch.customId === action.payload.id
                ) {
                    chat = ch;
                    break;
                }
            }
        }

        // @ts-ignore
        mergeData(chat, action.payload.data);
    });

    builder.addCase(SessionActions.logoutUser, (state) => {
        return {};
    });
});

export default roomsReducer;
