import { IChat } from "../../models/chat/types";

export interface IKeyValueState {
    [key: string]: any;
}

export enum KeyValueKeys {
    ShowAppMenu = "showAppMenu",
    ShowOrgMenu = "showOrgMenu",
    ShowNewOrgForm = "showNewOrgForm",
    RootBlocksLoaded = "rootBlocksLoaded",
    RoomsSubscribedTo = "roomsSubscribedTo",
    SocketDisconnectedAt = "socketDisconnectedAt",
    FetchingMissingBroadcasts = "fetchingMissingBroadcasts",
    UnseenChatsCountByOrg = "unseenChatsCountByOrg",
    QueuedChats = "queuedChats",
    LoginAgain = "loginAgain",
    SubscribeToPushNotifications = "SubscribeToPushNotifications",
}

export interface IUnseenChatsCountByOrg {
    [key: string]: number;
}

export type ResourceType = "board" | "org" | "user" | "room";

export interface IRoomLikeResource {
    customId: string;
    type: ResourceType;
}

export type ClientSubscribedResources = IRoomLikeResource[];

export interface IQueuedChatsByRoomId {
    [key: string]: Array<IChat & { chatIndex: number }>;
}
