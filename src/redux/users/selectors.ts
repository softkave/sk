import { getResourcesAsArray } from "../referenceCounting";
import { IReduxState } from "../store";

export function getUser(state: IReduxState, userID: string) {
  const users = getResourcesAsArray(state.users, [userID]);
  return users[0];
}

export function getUsersAsArray(state: IReduxState, ids: string[]) {
  return getResourcesAsArray(state.users, ids);
}
