import { getCollectionItemsAsArray } from "../collection";
import { IReduxState } from "../store";

export function getNotification(state: IReduxState, roleID: string) {
  const roles = getCollectionItemsAsArray(state.notifications, [roleID]);
  return roles[0];
}

export function getNotificationsAsArray(state: IReduxState, ids: string[]) {
  return getCollectionItemsAsArray(state.notifications, ids);
}
