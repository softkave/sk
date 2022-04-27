import { createReducer } from "@reduxjs/toolkit";
import isNumber from "lodash/isNumber";
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

    if (room.customId) {
      delete state[action.payload.id];
      state[room.customId] = room;
    }

    if (
      action.payload.data.members &&
      !action.payload.data.unseenChatsStartIndex &&
      !action.payload.data.unseenChatsCount
    ) {
      const { unseenChatsStartIndex, unseenChatsCount } =
        getRoomUserUnseenChatsCountAndStartIndex(room);
      room.unseenChatsStartIndex = unseenChatsStartIndex;
      room.unseenChatsCount = unseenChatsCount;
    }
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
      state[room.customId || param.id] = room;
    });
  });

  builder.addCase(RoomActions.bulkDeleteRooms, (state, action) => {
    action.payload.forEach((id) => delete state[id]);
  });

  builder.addCase(RoomActions.addChat, (state, action) => {
    let room = state[action.payload.roomId];

    if (!room) {
      const rmId = Object.keys(state).find((id) => {
        const rm = state[id];
        return (
          rm.orgId === action.payload.orgId &&
          rm.recipientId === action.payload.recipientId
        );
      })!;

      room = state[rmId];
    }

    if (!room) {
      return;
    }

    room.chats.push(action.payload.chat);

    if (action.payload.markAsUnseen) {
      room.unseenChatsCount += 1;

      if (isNumber(room.unseenChatsStartIndex)) {
        room.unseenChatsStartIndex = room.chats.length - 1;
      }
    }
  });

  builder.addCase(RoomActions.updateChat, (state, action) => {
    const room =
      state[action.payload.roomId] || state[action.payload.roomTempId];
    let chat: IChat | undefined;

    if (
      action.payload.chatIndex &&
      action.payload.chatIndex < room.chats.length &&
      (room.chats[action.payload.chatIndex].customId ===
        action.payload.chatTempId ||
        room.chats[action.payload.chatIndex].customId === action.payload.id)
    ) {
      chat = room.chats[action.payload.chatIndex];
    } else {
      // Reverse search because we most likely are trying to update the latest chat entry id
      for (let i = room.chats.length - 1; i >= 0; i--) {
        const nextChat = room.chats[i];

        if (
          nextChat.customId === action.payload.chatTempId ||
          nextChat.customId === action.payload.id
        ) {
          chat = nextChat;
          break;
        }
      }
    }

    if (!chat) {
      return;
    }

    mergeData(chat, action.payload.data);
  });

  builder.addCase(SessionActions.logoutUser, (state) => {
    return {};
  });
});

export default roomsReducer;
