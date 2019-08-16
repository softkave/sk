import { getResource, getResourcesAsArray } from "../referenceCounting";
import { IReduxState } from "../store";

export function getUser(state: IReduxState, userID: string) {
  return getResource(state.users, userID);
}

export function getUsersAsArray(state: IReduxState, ids: string[]) {
  return getResourcesAsArray(state.users, ids);
}
