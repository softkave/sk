import { getResourcesAsArray } from "../referenceCounting";
import { IReduxState } from "../store";

export function getRole(state: IReduxState, roleID: string) {
  const roles = getResourcesAsArray(state.roles, [roleID]);
  return roles[0];
}

export function getRolesAsArray(state: IReduxState, ids: string[]) {
  return getResourcesAsArray(state.roles, ids);
}
