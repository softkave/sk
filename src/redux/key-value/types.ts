export interface IKeyValueState {
  [key: string]: any;
}

export enum KeyValueKeys {
  CachedOrgPath = "cachedOrgPath",
  AppMenu = "appMenu",
  OrgMenu = "orgMenu",
  ShowNewOrgForm = "showNewOrgForm",
  RootBlocksLoaded = "rootBlocksLoaded",
  Rooms = "rooms",
  SocketDisconnectTimestamp = "socketDisconnectTimestamp",
  FetchingMissingBroadcasts = "fetchingMissingBroadcasts",
}
