import { RightCircleTwoTone } from "@ant-design/icons";
import { Button, Modal, Space, Typography } from "antd";
import React from "react";
import { Edit3, Trash2 } from "react-feather";
import {
    IPermission,
    IPermissionGroup,
} from "../../models/access-control/types";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";
import PermissionGroupUserAvatars from "./PermissionGroupUserAvatars";

export interface IPermissionGroupProps {
    permissionGroup: IPermissionGroup;
    users: IUser[];
    permissions: IPermission[];
    deletePermissionGroup: (permissionGroup: IPermissionGroup) => Promise<void>;
}

const kPromptMessage = "Do you want to delete this permission group?";

const PermissionGroup: React.FC<IPermissionGroupProps> = (props) => {
    const {
        permissionGroup,
        users,
        permissions,
        deletePermissionGroup,
    } = props;

    const [showEditForm, setShowEditForm] = React.useState(false);
    const [showPermissions, setShowPermissions] = React.useState(false);

    const toggleEditForm = React.useCallback(() => {
        setShowEditForm(!showEditForm);
    }, [showEditForm]);

    const togglePermissions = React.useCallback(() => {
        setShowPermissions(!showPermissions);
    }, [showPermissions]);

    const promptDeletePermissionGroup = React.useCallback(() => {
        Modal.confirm({
            title: kPromptMessage,
            okText: "Yes",
            cancelText: "No",
            okType: "primary",
            okButtonProps: { danger: true },
            onOk: () => deletePermissionGroup(permissionGroup),
            onCancel() {
                // do nothing
            },
        });
    }, [permissionGroup]);

    return (
        <Space direction="vertical">
            <Typography.Text strong>{permissionGroup.name}</Typography.Text>
            {permissionGroup.description && (
                <Typography.Text>{permissionGroup.description}</Typography.Text>
            )}
            <PermissionGroupUserAvatars users={users} />
            <StyledContainer
                s={{
                    color: "rgb(24, 144, 255)",
                    textDecoration: "underline",
                    cursor: "pointer",
                }}
                onClick={togglePermissions}
            >
                <Space>
                    <RightCircleTwoTone />
                    <Typography.Text>See or Edit permissions</Typography.Text>
                </Space>
            </StyledContainer>
            <Space>
                <Button
                    icon={<Edit3 style={{ width: "14px", height: "14px" }} />}
                    onClick={toggleEditForm}
                    htmlType="button"
                    className="icon-btn"
                />
                <Button
                    icon={<Trash2 style={{ width: "14px", height: "14px" }} />}
                    onClick={promptDeletePermissionGroup}
                    htmlType="button"
                    className="icon-btn"
                />
            </Space>
        </Space>
    );
};

export default PermissionGroup;
