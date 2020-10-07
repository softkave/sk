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
}

export interface IUnseenChatsCountByOrg {
    [key: string]: number;
}

export type ResourceType = "board" | "org" | "user" | "room";

export interface ISubscriptionableResource {
    customId: string;
    type: ResourceType;
}

export type ClientSubscribedResources = ISubscriptionableResource[];

export interface IQueuedChatsByRoomId {
    [key: string]: Array<IChat & { chatIndex: number }>;
}
