import { IChat, IRoom } from "../models/chat/types";
import { OutgoingSocketEvents, promisifiedEmit } from "./socket";
import { IEndpointResultBase } from "./types";

export interface IGetRoomsAPIParameters {
    orgId: string;
}

export interface IGetRoomsAPIResult extends IEndpointResultBase {
    rooms: IRoom[];
}

async function getRooms(props: IGetRoomsAPIParameters) {
    return await promisifiedEmit<IGetRoomsAPIResult>(
        OutgoingSocketEvents.GetRooms,
        props
    );
}

export interface IGetMessagesAPIParameters {
    orgId: string;
    roomIds: string[];
}

export interface IGetMessagesAPIResult extends IEndpointResultBase {
    chats: IChat[];
}

async function getMessages(props: IGetMessagesAPIParameters) {
    return promisifiedEmit<IGetMessagesAPIResult>(
        OutgoingSocketEvents.GetMessages,
        props
    );
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
    public static getRooms = getRooms;
    public static getMessages = getMessages;
    public static sendMessage = sendMessage;
    public static updateRoomReadCounter = updateRoomReadCounter;
}
