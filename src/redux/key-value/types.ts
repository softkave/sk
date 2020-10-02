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
    CurrentOrgId = "currentOrgId",
}

export interface IUnseenChatsCountByOrg {
    [key: string]: number;
}
