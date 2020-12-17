import { IPermissionGroup } from "../../models/access-control/types";

export interface IPermissionGroupsState {
    [key: string]: IPermissionGroup;
}
