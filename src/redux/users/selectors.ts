import { getCollectionItem, getCollectionItemsAsArray } from "../collection";
import { IAppState } from "../store";

export function getUser(state: IAppState, userId: string) {
  return getCollectionItem(state.users, userId);
}

export function getUsersAsArray(state: IAppState, ids: string[]) {
  return getCollectionItemsAsArray(state.users, ids);
}
