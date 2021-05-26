import { ClientSubscribedResources } from "../../redux/key-value/types";

export enum OutgoingSocketEvents {
    Auth = "auth",
    Subscribe = "subscribe",
    Unsubscribe = "unsubscribe",
    FetchMissingBroadcasts = "fetchMissingBroadcasts",
    SendMessage = "sendMessage",
    GetUserRoomsAndChats = "getUserRoomsAndChats",
    UpdateRoomReadCounter = "updateRoomReadCounter",
    UpdateSocketEntry = "updateSocketEntry",
}

export interface IOutgoingEventPacket<T = any> {
    token: string;
    clientId: string;
    data?: T;
}

export interface IOutgoingSubscribePacket {
    items: ClientSubscribedResources;
}

export interface IOutgoingFetchMissingBroadcastsPacket {
    rooms: string[];
    from: number;
}

export interface IOutgoingUpdateSocketEntryPacket {
    isInactive?: boolean;
}
