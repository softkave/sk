import { List, Space, Typography } from "antd";
import React from "react";
import { IPermissionGroup } from "../../models/access-control/types";
import { IBlock } from "../../models/block/block";
import EmptyMessage from "../EmptyMessage";
import ListHeader from "../utilities/ListHeader";
import PermissionGroupFormModal from "./PermissionGroupFormModal";
import PermissionGroupItem from "./PermissionGroupItem";

export interface IPermissionGroupsListProps {
    blockId: string;
    org: IBlock;
    permissionGroups: IPermissionGroup[];
    deletePermissionGroup: (permissionGroup: IPermissionGroup) => Promise<void>;
}

interface IFormData {
    show?: boolean;
    data?: IPermissionGroup;
}

const BoardList: React.FC<IPermissionGroupsListProps> = (props) => {
    const { blockId, org, permissionGroups } = props;

    const [searchText, setSearchText] = React.useState("");
    const [form, setForm] = React.useState<IFormData | undefined>();

    const closeForm = React.useCallback(() => {
        // TODO: prompt the user if she has unsaved changes
        setForm(undefined);
    }, []);

    const openForm = React.useCallback((pg?: IPermissionGroup) => {
        setForm({
            show: true,
            data: pg,
        });
    }, []);

    if (permissionGroups.length === 0) {
        return (
            <EmptyMessage>
                <Typography.Paragraph>
                    Create a group to get started
                </Typography.Paragraph>
            </EmptyMessage>
        );
    }

    const filterPermissionGroups = () => {
        if (!searchText) {
            return permissionGroups;
        }

        const lowercased = searchText.toLowerCase();
        return permissionGroups.filter((pg) =>
            pg.name.toLowerCase().includes(lowercased)
        );
    };

    const renderForm = () => {
        if (form) {
            return (
                <PermissionGroupFormModal
                    blockId={blockId}
                    onClose={closeForm}
                    org={org}
                    permissionGroup={form.data}
                />
            );
        }

        return null;
    };

    const filteredGroups = filterPermissionGroups();

    if (filteredGroups.length === 0) {
        return (
            <EmptyMessage>
                <Typography.Paragraph>
                    Permission group not found!
                </Typography.Paragraph>
            </EmptyMessage>
        );
    }

    return (
        <Space direction="vertical" size="middle">
            <ListHeader
                onClickCreate={openForm}
                onSearchTextChange={setSearchText}
                title="Permission groups"
                searchPlaceholder="Search groups..."
            />
            <List
                dataSource={filteredGroups}
                renderItem={(pg) => (
                    <PermissionGroupItem
                        deletePermissionGroup={}
                        permissionGroup={}
                        users={}
                    />
                )}
            />
        </Space>
    );
};

export default BoardList;
