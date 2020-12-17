import { IUserAssignedPermissionGroup } from "../../models/access-control/types";
import { IAppState } from "../types";

function getUserAssignedPermissionGroup(
    state: IAppState,
    userassignedpermissiongroupId: string
) {
    return state.userAssignedPermissionGroups[userassignedpermissiongroupId];
}

function getUserAssignedPermissionGroupsAsArray(
    state: IAppState,
    ids: string[]
) {
    return ids.reduce((userAssignedPermissionGroup, id) => {
        if (state.userAssignedPermissionGroups[id]) {
            userAssignedPermissionGroup.push(
                state.userAssignedPermissionGroups[id]
            );
        }

        return userAssignedPermissionGroup;
    }, [] as IUserAssignedPermissionGroup[]);
}

export default class UserAssignedPermissionGroupSelectors {
    public static getUserAssignedPermissionGroup = getUserAssignedPermissionGroup;
    public static getUserAssignedPermissionGroups = getUserAssignedPermissionGroupsAsArray;
}
