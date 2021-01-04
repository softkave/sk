import { ClientSubscribedResources } from "../../redux/key-value/types";

export enum OutgoingSocketEvents {
    Auth = "auth",
    Subscribe = "subscribe",
    Unsubscribe = "unsubscribe",
    FetchMissingBroadcasts = "fetchMissingBroadcasts",
    SendMessage = "sendMessage",
    GetUserRoomsAndChats = "getUserRoomsAndChats",
    UpdateRoomReadCounter = "updateRoomReadCounter",
}

export interface IOutgoingEventPacket<T = any> {
    token: string;
    data?: T;
}

export interface IOutgoingSubscribePacket {
    items: ClientSubscribedResources;
}

export interface IOutgoingFetchMissingBroadcastsPacket {
    rooms: string[];
    from: number;
}