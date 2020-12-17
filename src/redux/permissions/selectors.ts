import { IPermission } from "../../models/access-control/types";
import { IAppState } from "../types";

function getPermission(state: IAppState, permissionId: string) {
    return state.permissions[permissionId];
}

function getPermissionsAsArray(state: IAppState, ids: string[]) {
    return ids.reduce((permissions, id) => {
        if (state.permissions[id]) {
            permissions.push(state.permissions[id]);
        }

        return permissions;
    }, [] as IPermission[]);
}

export default class PermissionSelectors {
    public static getPermission = getPermission;
    public static getPermissions = getPermissionsAsArray;
}
