import { getCollectionItem, getCollectionItemsAsArray } from "../collection";
import { IAppState } from "../store";

export function getUser(state: IAppState, userID: string) {
  return getCollectionItem(state.users, userID);
}

export function getUsersAsArray(state: IAppState, ids: string[]) {
  return getCollectionItemsAsArray(state.users, ids);
}
