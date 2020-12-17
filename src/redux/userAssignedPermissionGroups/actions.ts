import { createAction } from "@reduxjs/toolkit";
import { IUserAssignedPermissionGroup } from "../../models/access-control/types";

const addUserAssignedPermissionGroup = createAction<IUserAssignedPermissionGroup>(
    "userAssignedPermissionGroup/addUserAssignedPermissionGroup"
);

const deleteUserAssignedPermissionGroup = createAction<string>(
    "userAssignedPermissionGroup/deleteUserAssignedPermissionGroup"
);

const bulkAddUserAssignedPermissionGroups = createAction<
    IUserAssignedPermissionGroup[]
>("userAssignedPermissionGroup/bulkAddUserAssignedPermissionGroups");

const bulkDeleteUserAssignedPermissionGroups = createAction<string[]>(
    "userAssignedPermissionGroup/bulkDeleteUserAssignedPermissionGroups"
);

class UserAssignedPermissionGroupActions {
    public static addUserAssignedPermissionGroup = addUserAssignedPermissionGroup;
    public static deleteUserAssignedPermissionGroup = deleteUserAssignedPermissionGroup;
    public static bulkAddUserAssignedPermissionGroups = bulkAddUserAssignedPermissionGroups;
    public static bulkDeleteUserAssignedPermissionGroups = bulkDeleteUserAssignedPermissionGroups;
}

export default UserAssignedPermissionGroupActions;
