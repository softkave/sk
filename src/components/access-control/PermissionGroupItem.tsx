import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Typography } from "antd";
import React from "react";
import { Trash2 } from "react-feather";
import { IPermissionGroup } from "../../models/access-control/types";
import { ICollaborator } from "../../models/user/user";

export interface IPermissionGroupItemProps {
    permissionGroup: IPermissionGroup;
    users: ICollaborator[];
    deletePermissionGroup: (permissionGroup: IPermissionGroup) => Promise<void>;
}

const kPromptMessage = "Do you want to delete this permission group?";

const PermissionGroupItem: React.FC<IPermissionGroupItemProps> = (props) => {
    const { permissionGroup, users, deletePermissionGroup } = props;

    const [showEditForm, setShowEditForm] = React.useState(false);

    const toggleEditForm = React.useCallback(() => {
        setShowEditForm(!showEditForm);
    }, [showEditForm]);

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
                <Typography.Text type="secondary">
                    {permissionGroup.description}
                </Typography.Text>
            )}
            <Typography.Text type="secondary">
                {users.length} collaborators
            </Typography.Text>
            <Space>
                <Button
                    icon={<EditOutlined />}
                    onClick={toggleEditForm}
                    htmlType="button"
                    className="icon-btn"
                />
                <Button
                    icon={<Trash2 />}
                    onClick={promptDeletePermissionGroup}
                    htmlType="button"
                    className="icon-btn"
                />
            </Space>
        </Space>
    );
};

export default PermissionGroupItem;
