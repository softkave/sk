import { IPermissionGroup } from "../../models/access-control/types";
import { getSelectors } from "../utils";

const PermissionGroupsSelectors = getSelectors<IPermissionGroup>(
    "permissionGroups"
);

export default PermissionGroupsSelectors;
