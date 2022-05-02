import {
  IChat,
  IRoom,
  IRoomMemberWithReadCounter,
} from "../../models/chat/types";
import { OutgoingSocketEvents } from "../socket/outgoingEventTypes";
import SocketAPI from "../socket/socket";
import { IEndpointResultBase } from "../types";

export interface IPersistedRoom {
  customId: string;
  name: string;
  orgId: string;
  createdAt: string;
  createdBy: string;
  members: IRoomMemberWithReadCounter[];
  updatedAt?: string;
  updatedBy?: string;
  lastChatCreatedAt?: string;
}

export interface IGetUserRoomsAndChatsAPIResult extends IEndpointResultBase {
  rooms: IPersistedRoom[];
  chats: IChat[];
}

async function getUserRoomsAndChats() {
  return await SocketAPI.promisifiedEmit<IGetUserRoomsAndChatsAPIResult>(
    OutgoingSocketEvents.GetUserRoomsAndChats
  );
}

export interface IGetMessagesAPIParameters {
  orgId: string;
  roomIds: string[];
}

export interface ISendMessageEndpointParameters {
  orgId: string;
  message: string;
  roomId: string;
}

export interface ISendMessageEndpointResult extends IEndpointResultBase {
  chat: IChat;
}

async function sendMessage(props: ISendMessageEndpointParameters) {
  return SocketAPI.promisifiedEmit<ISendMessageEndpointResult>(
    OutgoingSocketEvents.SendMessage,
    props
  );
}

export interface IAddRoomEndpointParameters {
  orgId: string;
  recipientId: string;
}

export interface IAddRoomEndpointResult extends IEndpointResultBase {
  room: IPersistedRoom;
}

async function addRoom(props: IAddRoomEndpointParameters) {
  return SocketAPI.promisifiedEmit<IAddRoomEndpointResult>(
    OutgoingSocketEvents.AddRoom,
    props
  );
}

export interface IGetRoomsEndpointParameters {
  orgId: string;
}

export interface IGetRoomsEndpointResult extends IEndpointResultBase {
  rooms: IPersistedRoom[];
}

async function getRooms(props: IGetRoomsEndpointParameters) {
  return SocketAPI.promisifiedEmit<IGetRoomsEndpointResult>(
    OutgoingSocketEvents.GetRoomChats,
    props
  );
}

export interface IGetRoomChatsEndpointParameters {
  roomId: string;
}

export interface IGetRoomChatsEndpointResult extends IEndpointResultBase {
  chats: IChat[];
}

async function getRoomChats(props: IGetRoomChatsEndpointParameters) {
  return SocketAPI.promisifiedEmit<IGetRoomChatsEndpointResult>(
    OutgoingSocketEvents.GetRoomChats,
    props
  );
}

export interface IGetRoomsUnseenChatsCountEndpointParameters {
  orgId: string;
  roomIds: string[];
}

export interface IGetRoomsUnseenChatsCountEndpointResult
  extends IEndpointResultBase {
  counts: Array<{
    roomId: string;
    count: number;
  }>;
}

async function getRoomsUnseenChatsCount(
  props: IGetRoomsUnseenChatsCountEndpointParameters
) {
  return SocketAPI.promisifiedEmit<IGetRoomsUnseenChatsCountEndpointResult>(
    OutgoingSocketEvents.GetRoomsUnseenChatsCount,
    props
  );
}

export interface IUpdateRoomReadCounterAPIParameters {
  orgId: string;
  roomId: string;
  readCounter: string;
}

export interface IUpdateRoomReadCounterEndpointResult
  extends IEndpointResultBase {
  readCounter: string;
  room: IRoom;
}

async function updateRoomReadCounter(
  props: IUpdateRoomReadCounterAPIParameters
) {
  return SocketAPI.promisifiedEmit<IUpdateRoomReadCounterEndpointResult>(
    OutgoingSocketEvents.UpdateRoomReadCounter,
    props
  );
}

export default class ChatAPI {
  public static getUserRoomsAndChats = getUserRoomsAndChats;
  public static sendMessage = sendMessage;
  public static addRoom = addRoom;
  public static getRooms = getRooms;
  public static getRoomChats = getRoomChats;
  public static getRoomsUnseenChatsCount = getRoomsUnseenChatsCount;
  public static updateRoomReadCounter = updateRoomReadCounter;
}
