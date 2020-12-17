import { IPermissionGroup } from "../../models/access-control/types";
import { IAppState } from "../types";

function getPermissionGroup(state: IAppState, permissionGroupId: string) {
    return state.permissionGroups[permissionGroupId];
}

function getPermissionGroupsAsArray(state: IAppState, ids: string[]) {
    return ids.reduce((permissionGroups, id) => {
        if (state.permissionGroups[id]) {
            permissionGroups.push(state.permissionGroups[id]);
        }

        return permissionGroups;
    }, [] as IPermissionGroup[]);
}

export default class PermissionGroupSelectors {
    public static getPermissionGroup = getPermissionGroup;
    public static getPermissionGroups = getPermissionGroupsAsArray;
}
