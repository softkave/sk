import { IPermission } from "../../models/access-control/types";

export interface IPermissionsState {
    [key: string]: IPermission;
}
