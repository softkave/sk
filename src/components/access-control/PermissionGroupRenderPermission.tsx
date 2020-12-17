import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Checkbox, Space, Typography } from "antd";
import React from "react";
import { IPermission } from "../../models/access-control/types";
import { SystemResourceType } from "../../models/app/types";
import StyledContainer from "../styled/Container";

export interface IPermissionGroupResourceTypePermissionsProps {
    resourceType: SystemResourceType;
    permissions: IPermission[];
}

const PermissionGroupResourceTypePermissions: React.FC<IPermissionGroupResourceTypePermissionsProps> = (
    props
) => {
    const { resourceType, permissions } = props;
    const [
        showIndividualPermissions,
        setShowIndividualPermissions,
    ] = React.useState(false);

    const toggleIndividualPermissions = React.useCallback(() => {
        setShowIndividualPermissions(!showIndividualPermissions);
    }, [showIndividualPermissions]);

    return (
        <Space direction="vertical">
            <StyledContainer>
                <Checkbox />
                <StyledContainer
                    s={{ marginLeft: "8px", flex: 1, cursor: "pointer" }}
                    onClick={toggleIndividualPermissions}
                >
                    <Typography.Text
                        strong
                        ellipsis
                        style={{
                            marginRight: "8px",
                            flex: 1,
                            display: "inline-flex",
                        }}
                    >
                        {resourceType}
                    </Typography.Text>
                    {showIndividualPermissions ? (
                        <UpOutlined />
                    ) : (
                        <DownOutlined />
                    )}
                </StyledContainer>
            </StyledContainer>
            <StyledContainer s={{ paddingLeft: "16px" }}>
                <Space direction="vertical">
                    {permissions.map((p) => (
                        <Checkbox key={p.customId}>{p.action}</Checkbox>
                    ))}
                </Space>
            </StyledContainer>
        </Space>
    );
};

export default PermissionGroupResourceTypePermissions;
