export interface IKeyValueState {
  [key: string]: boolean | number | string | object;
}

export enum KeyValueKeys {
  CachedOrgPath = "cachedOrgPath",
  AppMenu = "appMenu",
  OrgMenu = "orgMenu",
  ShowNewOrgForm = "showNewOrgForm",
  RootBlocksLoaded = "rootBlocksLoaded",
  ReloadBoard = "reloadBoard",
}
