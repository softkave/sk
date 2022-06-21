import * as yup from "yup";
import {
  IChat,
  IRoom,
  IRoomMemberWithReadCounter,
} from "../../models/chat/types";
import { OutgoingSocketEvents } from "../socket/outgoingEventTypes";
import SocketAPI from "../socket/socket";
import { IEndpointResultBase } from "../types";
import { endpointYupOptions } from "../utils";

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
  localId?: string;
}

export interface ISendMessageEndpointResult extends IEndpointResultBase {
  chat: IChat;
}

const sendMessageYupSchema = yup.object().shape({
  orgId: yup.string().required(),
  message: yup.string().required(),
  roomId: yup.string().required(),
  localId: yup.string(),
});

async function sendMessage(props: ISendMessageEndpointParameters) {
  return SocketAPI.promisifiedEmit<ISendMessageEndpointResult>(
    OutgoingSocketEvents.SendMessage,
    sendMessageYupSchema.validateSync(props, endpointYupOptions)
  );
}

export interface IAddRoomEndpointParameters {
  orgId: string;
  recipientId: string;
}

export interface IAddRoomEndpointResult extends IEndpointResultBase {
  room: IPersistedRoom;
}

const addRoomYupSchema = yup.object().shape({
  orgId: yup.string().required(),
  recipientId: yup.string().required(),
});

async function addRoom(props: IAddRoomEndpointParameters) {
  return SocketAPI.promisifiedEmit<IAddRoomEndpointResult>(
    OutgoingSocketEvents.AddRoom,
    addRoomYupSchema.validateSync(props, endpointYupOptions)
  );
}

export interface IGetRoomsEndpointParameters {
  orgId: string;
}

export interface IGetRoomsEndpointResult extends IEndpointResultBase {
  rooms: IPersistedRoom[];
}

const getRoomsYupSchema = yup.object().shape({
  orgId: yup.string().required(),
});

async function getRooms(props: IGetRoomsEndpointParameters) {
  return SocketAPI.promisifiedEmit<IGetRoomsEndpointResult>(
    OutgoingSocketEvents.GetRooms,
    getRoomsYupSchema.validateSync(props, endpointYupOptions)
  );
}

export interface IGetRoomChatsEndpointParameters {
  roomId: string;
}

export interface IGetRoomChatsEndpointResult extends IEndpointResultBase {
  chats: IChat[];
}

const getRoomChatsYupSchema = yup.object().shape({
  roomId: yup.string().required(),
});

async function getRoomChats(props: IGetRoomChatsEndpointParameters) {
  return SocketAPI.promisifiedEmit<IGetRoomChatsEndpointResult>(
    OutgoingSocketEvents.GetRoomChats,
    getRoomChatsYupSchema.validateSync(props, endpointYupOptions)
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

const getRoomsUnseenChatsCountYupSchema = yup.object().shape({
  orgId: yup.string().required(),
  roomIds: yup.array().of(yup.string()).required(),
});

async function getRoomsUnseenChatsCount(
  props: IGetRoomsUnseenChatsCountEndpointParameters
) {
  return SocketAPI.promisifiedEmit<IGetRoomsUnseenChatsCountEndpointResult>(
    OutgoingSocketEvents.GetRoomsUnseenChatsCount,
    getRoomsUnseenChatsCountYupSchema.validateSync(props, endpointYupOptions)
  );
}

export interface IGetOrganizationUnseenChatsCountEndpointParameters {
  orgId: string;
}

export interface IGetOrganizationUnseenChatsCountEndpointResult
  extends IEndpointResultBase {
  count: number;
}

const getOrganizationUnseenChatsCountYupSchema = yup.object().shape({
  orgId: yup.string().required(),
});

async function getOrganizationUnseenChatsCount(
  props: IGetOrganizationUnseenChatsCountEndpointParameters
) {
  return SocketAPI.promisifiedEmit<IGetOrganizationUnseenChatsCountEndpointResult>(
    OutgoingSocketEvents.GetOrganizationUnseenChatsCount,
    getOrganizationUnseenChatsCountYupSchema.validateSync(
      props,
      endpointYupOptions
    )
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

const updateRoomReadCounterYupSchema = yup.object().shape({
  orgId: yup.string().required(),
  roomId: yup.string().required(),
  readCounter: yup.string().required(),
});

async function updateRoomReadCounter(
  props: IUpdateRoomReadCounterAPIParameters
) {
  return SocketAPI.promisifiedEmit<IUpdateRoomReadCounterEndpointResult>(
    OutgoingSocketEvents.UpdateRoomReadCounter,
    updateRoomReadCounterYupSchema.validateSync(props, endpointYupOptions)
  );
}

export default class ChatAPI {
  public static getUserRoomsAndChats = getUserRoomsAndChats;
  public static sendMessage = sendMessage;
  public static addRoom = addRoom;
  public static getRooms = getRooms;
  public static getRoomChats = getRoomChats;
  public static getOrganizationUnseenChatsCount =
    getOrganizationUnseenChatsCount;
  public static getRoomsUnseenChatsCount = getRoomsUnseenChatsCount;
  public static updateRoomReadCounter = updateRoomReadCounter;
}
