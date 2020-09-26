import { createAction } from "@reduxjs/toolkit";
import { IRoom } from "../../models/chat/types";
import { IMergeDataMeta } from "../../utils/utils";

const addRoom = createAction<IRoom>("rooms/addRoom");

export interface IUpdateRoomActionArgs {
    id: string;
    data: Partial<IRoom>;
    meta?: IMergeDataMeta;
}

const updateRoom = createAction<IUpdateRoomActionArgs>("rooms/updateRoom");

const deleteRoom = createAction<string>("rooms/deleteRoom");

const bulkAddRooms = createAction<IRoom[]>("rooms/bulkAddRooms");

const bulkUpdateRooms = createAction<IUpdateRoomActionArgs[]>(
    "rooms/bulkUpdateRooms"
);

const bulkDeleteRooms = createAction<string[]>("rooms/bulkDeleteRooms");

export interface IUpdateRoomReadCounterActionArgs {
    roomId: string;
    userId: string;
    readCounter: string;
}

const updateRoomReadCounter = createAction<IUpdateRoomReadCounterActionArgs>(
    "rooms/updateRoomReadCounter"
);

class RoomActions {
    public static addRoom = addRoom;
    public static updateRoom = updateRoom;
    public static deleteRoom = deleteRoom;
    public static bulkAddRooms = bulkAddRooms;
    public static bulkUpdateRooms = bulkUpdateRooms;
    public static bulkDeleteRooms = bulkDeleteRooms;
    public static updateRoomReadCounter = updateRoomReadCounter;
}

export default RoomActions;
