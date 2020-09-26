import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import RoomActions from "./actions";
import { IRoomsState } from "./types";

const roomsReducer = createReducer<IRoomsState>({}, (builder) => {
    builder.addCase(RoomActions.addRoom, (state, action) => {
        state[action.payload.customId] = action.payload;
    });

    builder.addCase(RoomActions.updateRoom, (state, action) => {
        state[action.payload.id] = mergeData(
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
            state[param.id] = mergeData(
                state[param.id],
                param.data,
                param.meta
            );
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
    });

    builder.addCase(SessionActions.logoutUser, (state) => {
        return {};
    });
});

export default roomsReducer;
