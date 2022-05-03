import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import RoomActions from "./actions";
import { IRoomsMap } from "./types";
import { getChatIndex } from "./utils";

const roomsReducer = createReducer<IRoomsMap>({}, (builder) => {
  builder.addCase(RoomActions.addRoom, (state, action) => {
    state[action.payload.customId] = action.payload;
  });

  builder.addCase(RoomActions.updateRoom, (state, action) => {
    mergeData(
      state[action.payload.id],
      action.payload.data,
      action.payload.meta
    );
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
    const room = state[action.payload.roomId];

    if (!room) {
      return;
    }

    if (action.payload.chat.localId) {
      const chatIndex = getChatIndex(
        room,
        action.payload.chat.localId,
        action.payload.chat.createdAt
      );

      if (chatIndex !== -1) {
        mergeData(room.chats[chatIndex], action.payload, {
          arrayUpdateStrategy: "replace",
        });
        return;
      }
    }

    room.chats.push(action.payload.chat);
  });

  builder.addCase(RoomActions.updateChat, (state, action) => {
    const room = state[action.payload.roomId];

    if (!room) {
      return;
    }

    const chatIndex = getChatIndex(
      room,
      action.payload.localId,
      action.payload.fromDate || action.payload.data.createdAt
    );

    if (chatIndex !== -1) {
      mergeData(
        room.chats[chatIndex],
        action.payload.data,
        action.payload.meta
      );
    }
  });

  builder.addCase(SessionActions.logoutUser, (state) => {
    return {};
  });
});

export default roomsReducer;
