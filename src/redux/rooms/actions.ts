import { createAction } from "@reduxjs/toolkit";
import { IChat, IRoom } from "../../models/chat/types";
import { IMergeDataMeta } from "../../utils/utils";
import { IUpdateResourcePayload } from "../types";

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
    isSignedInUser: boolean;
}

const updateRoomReadCounter = createAction<IUpdateRoomReadCounterActionArgs>(
    "rooms/updateRoomReadCounter"
);

export interface IAddChatActionArgs {
    chat: IChat;
    recipientId: string;
    roomId: string;
}

const addChat = createAction<IAddChatActionArgs>("rooms/addChat");

export interface IUpdateChatActionArgs extends IUpdateResourcePayload<IChat> {
    roomId: string;
    roomTempId: string;
    chatTempId: string;
    chatIndex?: number;
}

const updateChat = createAction<IUpdateChatActionArgs>("room/updateChat");

class RoomActions {
    public static addRoom = addRoom;
    public static updateRoom = updateRoom;
    public static deleteRoom = deleteRoom;
    public static bulkAddRooms = bulkAddRooms;
    public static bulkUpdateRooms = bulkUpdateRooms;
    public static bulkDeleteRooms = bulkDeleteRooms;
    public static updateRoomReadCounter = updateRoomReadCounter;
    public static addChat = addChat;
    public static updateChat = updateChat;
}

export default RoomActions;