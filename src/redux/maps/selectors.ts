import { compact } from "lodash";
import { SystemResourceType } from "../../models/app/types";
import { IResourceWithId } from "../../models/types";
import cast from "../../utils/cast";
import { IAppState } from "../types";
import { IMapsKeyValue } from "./types";

function getMap<T extends IResourceWithId = IResourceWithId>(
  state: IAppState,
  key: SystemResourceType
) {
  return cast<IMapsKeyValue<T> | undefined>(state.maps[key]);
}

function getLegacyMap(state: IAppState, type: SystemResourceType) {
  switch (type) {
    case SystemResourceType.Workspace:
      return state.organizations;
    case SystemResourceType.Board:
      return state.boards;
    case SystemResourceType.Task:
      return state.tasks;
    case SystemResourceType.CollaborationRequest:
      return state.collaborationRequests;
    case SystemResourceType.Sprint:
      return state.sprints;
    case SystemResourceType.Comment:
      return state.comments;
    case SystemResourceType.User:
    case SystemResourceType.AnonymousUser:
    case SystemResourceType.DemoUser:
      return state.users;
  }
  return {};
}

function getItem<T extends IResourceWithId = IResourceWithId>(
  state: IAppState,
  key: SystemResourceType,
  customId: string
): T | undefined {
  const map = getMap<T>(state, key) ?? {};
  const legacyMap = getLegacyMap(state, key);
  return map[customId] ?? legacyMap[customId];
}

function getList<T extends IResourceWithId = IResourceWithId>(
  state: IAppState,
  key: SystemResourceType,
  idList: string[],
  startIndex = 0,
  count = idList.length,
  compactList = true
) {
  const map = getMap<T>(state, key) ?? {};
  const legacyMap = getLegacyMap(state, key);
  let list: T[] = [];
  for (let i = startIndex; i < startIndex + count && i < idList.length; i++) {
    if (i in idList) {
      const id = idList[i];
      const item = map[id] ?? legacyMap[id];
      list.push(item);
    }
  }
  if (compactList) {
    list = compact(list);
  }
  return list;
}

export default class MapsSelectors {
  static getMap = getMap;
  static getItem = getItem;
  static getList = getList;
}
