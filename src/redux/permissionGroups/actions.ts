import { createAction } from "@reduxjs/toolkit";
import { IPermissionGroup } from "../../models/access-control/types";
import { IMergeDataMeta } from "../../utils/utils";

const addPermissionGroup = createAction<IPermissionGroup>(
    "permissionGroups/addPermissionGroup"
);

export interface IUpdatePermissionGroupActionArgs {
    id: string;
    data: Partial<IPermissionGroup>;
    meta?: IMergeDataMeta;
}

const updatePermissionGroup = createAction<IUpdatePermissionGroupActionArgs>(
    "permissionGroups/updatePermissionGroup"
);

const deletePermissionGroup = createAction<string>(
    "permissionGroups/deletePermissionGroup"
);

const bulkAddPermissionGroups = createAction<IPermissionGroup[]>(
    "permissionGroups/bulkAddPermissionGroups"
);

const bulkUpdatePermissionGroups = createAction<
    IUpdatePermissionGroupActionArgs[]
>("permissionGroups/bulkUpdatePermissionGroups");

const bulkDeletePermissionGroups = createAction<string[]>(
    "permissionGroups/bulkDeletePermissionGroups"
);

class PermissionGroupActions {
    public static addPermissionGroup = addPermissionGroup;
    public static updatePermissionGroup = updatePermissionGroup;
    public static deletePermissionGroup = deletePermissionGroup;
    public static bulkAddPermissionGroups = bulkAddPermissionGroups;
    public static bulkUpdatePermissionGroups = bulkUpdatePermissionGroups;
    public static bulkDeletePermissionGroups = bulkDeletePermissionGroups;
}

export default PermissionGroupActions;
