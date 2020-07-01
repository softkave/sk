export interface IKeyValueState {
  [key: string]: boolean | number | string | object;
}

export enum KeyValueKeys {
  CachedOrgPath = "cachedOrgPath",
  AppMenu = "appMenu",
  ShowNewOrgForm = "showNewOrgForm",
  RootBlocksLoaded = "rootBlocksLoaded",
}
