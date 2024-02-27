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
const bulkUpdateRooms = createAction<IUpdateRoomActionArgs[]>("rooms/bulkUpdateRooms");

const bulkDeleteRooms = createAction<string[]>("rooms/bulkDeleteRooms");

export interface IUpdateRoomReadCounterActionArgs {
  roomId: string;
  userId: string;
  readCounter: string;
  isSignedInUser: boolean;
}

export interface IAddChatActionArgs {
  chat: IChat;
  roomId: string;
}

const addChat = createAction<IAddChatActionArgs>("rooms/addChat");

export interface IUpdateChatActionArgs extends Omit<IUpdateResourcePayload<IChat>, "id"> {
  roomId: string;
  localId: string;
  fromDate?: string;
}

const updateChat = createAction<IUpdateChatActionArgs>("room/updateChat");

class RoomActions {
  static addRoom = addRoom;
  static updateRoom = updateRoom;
  static deleteRoom = deleteRoom;
  static bulkAddRooms = bulkAddRooms;
  static bulkUpdateRooms = bulkUpdateRooms;
  static bulkDeleteRooms = bulkDeleteRooms;
  static addChat = addChat;
  static updateChat = updateChat;
}

export default RoomActions;
