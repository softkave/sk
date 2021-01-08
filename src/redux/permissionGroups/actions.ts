import { IPermissionGroup } from "../../models/access-control/types";
import { getActions } from "../utils";

const PermissionGroupsActions = getActions<IPermissionGroup>(
    "permissiongroups"
);

export default PermissionGroupsActions;
