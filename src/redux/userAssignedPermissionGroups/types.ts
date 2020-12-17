import { IUserAssignedPermissionGroup } from "../../models/access-control/types";

export interface IUserAssignedPermissionGroupsState {
    [key: string]: IUserAssignedPermissionGroup;
}
