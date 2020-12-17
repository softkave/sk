import { createAction } from "@reduxjs/toolkit";
import { IPermission } from "../../models/access-control/types";
import { IMergeDataMeta } from "../../utils/utils";

export interface IUpdatePermissionActionArgs {
    id: string;
    data: Partial<IPermission>;
    meta?: IMergeDataMeta;
}

const updatePermission = createAction<IUpdatePermissionActionArgs>(
    "permissions/updatePermission"
);

const bulkAddPermissions = createAction<IPermission[]>(
    "permissions/bulkAddPermissions"
);

const bulkUpdatePermissions = createAction<IUpdatePermissionActionArgs[]>(
    "permissions/bulkUpdatePermissions"
);

class PermissionActions {
    public static updatePermission = updatePermission;
    public static bulkUpdatePermissions = bulkUpdatePermissions;
    public static bulkAddPermissions = bulkAddPermissions;
}

export default PermissionActions;
