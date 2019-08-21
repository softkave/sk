import { getResourcesAsArray } from "../referenceCounting";
import { IReduxState } from "../store";

export function getNotification(state: IReduxState, roleID: string) {
  const roles = getResourcesAsArray(state.notifications, [roleID]);
  return roles[0];
}

export function getNotificationsAsArray(state: IReduxState, ids: string[]) {
  return getResourcesAsArray(state.notifications, ids);
}
