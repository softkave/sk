import { getCollectionItem, getCollectionItemsAsArray } from "../collection";
import { IReduxState } from "../store";

export function getUser(state: IReduxState, userID: string) {
  return getCollectionItem(state.users, userID);
}

export function getUsersAsArray(state: IReduxState, ids: string[]) {
  return getCollectionItemsAsArray(state.users, ids);
}
