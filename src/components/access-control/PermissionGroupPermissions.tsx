import { Space } from "antd";
import React from "react";
import { IPermission } from "../../models/access-control/types";
import { permissionsListToMap } from "../../models/access-control/utils";
import { SystemResourceType } from "../../models/app/types";
import PermissionGroupResourceTypePermissions from "./PermissionGroupRenderPermission";

export interface IPermissionGroupPermissionsProps {
    permissions: IPermission[];
}

const PermissionGroupPermissions: React.FC<IPermissionGroupPermissionsProps> = (
    props
) => {
    const { permissions } = props;
    const permissionsMap = permissionsListToMap(permissions);
    const nodes = Object.keys(permissionsMap).map((type) => {
        const p1 = permissionsMap[type];

        return (
            <PermissionGroupResourceTypePermissions
                key={type}
                resourceType={type as SystemResourceType}
                permissions={p1}
            />
        );
    });

    return (
        <Space direction="vertical" size="large">
            {nodes}
        </Space>
    );
};

export default PermissionGroupPermissions;
