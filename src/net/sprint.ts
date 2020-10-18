import { IChat, IRoomMemberWithReadCounter } from "../models/chat/types";
import { OutgoingSocketEvents, promisifiedEmit } from "./socket";
import { IEndpointResultBase } from "./types";

export interface IPersistedRoom {
    customId: string;
    name: string;
    orgId: string;
    createdAt: string;
    createdBy: string;
    members: IRoomMemberWithReadCounter[];
    updatedAt?: string;
    updatedBy?: string;
}

export interface IGetUserRoomsAndChatsAPIResult extends IEndpointResultBase {
    rooms: IPersistedRoom[];
    chats: IChat[];
}

async function getUserRoomsAndChats() {
    return await promisifiedEmit<IGetUserRoomsAndChatsAPIResult>(
        OutgoingSocketEvents.GetUserRoomsAndChats
    );
}

export interface IGetMessagesAPIParameters {
    orgId: string;
    roomIds: string[];
}

export interface ISendMessageAPIParameters {
    orgId: string;
    message: string;
    roomId?: string;
    recipientId?: string;
}

export interface ISendMessageAPIResult extends IEndpointResultBase {
    chat: IChat;
}

async function sendMessage(props: ISendMessageAPIParameters) {
    return promisifiedEmit<ISendMessageAPIResult>(
        OutgoingSocketEvents.SendMessage,
        props
    );
}

export interface IUpdateRoomReadCounterAPIParameters {
    orgId: string;
    roomId: string;
    readCounter: string;
}

async function updateRoomReadCounter(
    props: IUpdateRoomReadCounterAPIParameters
) {
    return promisifiedEmit<IEndpointResultBase>(
        OutgoingSocketEvents.UpdateRoomReadCounter,
        props
    );
}

export default class ChatAPI {
    public static getUserRoomsAndChats = getUserRoomsAndChats;
    public static sendMessage = sendMessage;
    public static updateRoomReadCounter = updateRoomReadCounter;
}
