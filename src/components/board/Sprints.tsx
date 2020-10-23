import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/DeleteOutlined";
import { Button, Dropdown, Menu } from "antd";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import RenderForDevice from "../RenderForDevice";
import GroupedTasksDesktop from "./GroupedTasksDesktop";
import GroupedTasksMobile from "./GroupedTasksMobile";
import { IBoardGroupedTasks } from "./types";

export interface ISprintsProps {
    board: IBlock;
    groups: IBoardGroupedTasks[];
    collaborators: IUser[];
    onUpdateSprint: (sprintId: string) => void;
    onDeleteSprint: (sprintId: string) => void;
    onClickUpdateBlock: (block: IBlock) => void;
}

enum SprintMenuOptions {
    EDIT = "EDIT",
    DELETE = "DELETE",
}

const Sprints: React.FC<ISprintsProps> = (props) => {
    const {
        board,
        groups,
        collaborators,
        onUpdateSprint,
        onDeleteSprint,
        onClickUpdateBlock,
    } = props;

    const renderDesktopColumnHeaderOptions = (group: IBoardGroupedTasks) => {
        const menuOnClick = (evt) => {
            switch (evt.key) {
                case SprintMenuOptions.EDIT:
                    onUpdateSprint(group.id);
                    break;

                case SprintMenuOptions.DELETE:
                    onDeleteSprint(group.id);
                    break;
            }
        };

        const menu = (
            <Menu onClick={menuOnClick}>
                <Menu.Item key={SprintMenuOptions.EDIT}>
                    <EditOutlined />
                    Edit Sprint
                </Menu.Item>
                <Menu.Item key={SprintMenuOptions.DELETE}>
                    <DeleteOutlined />
                    Delete Sprint
                </Menu.Item>
            </Menu>
        );

        return (
            <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement="bottomRight"
                className="task-menu-dropdown"
            >
                <Button
                    icon={<MoreHorizontal />}
                    style={{
                        border: 0,
                        padding: 0,
                        backgroundColor: "inherit",
                        borderRadius: 0,
                        boxShadow: "none",
                        height: "22px",
                    }}
                />
            </Dropdown>
        );
    };

    const renderGroupedTasksDesktop = () => {
        return (
            <GroupedTasksDesktop
                board={board}
                groupedTasks={groups}
                users={collaborators}
                onClickUpdateBlock={onClickUpdateBlock}
                renderColumnHeaderOptions={renderDesktopColumnHeaderOptions}
            />
        );
    };

    const renderGroupedTasksMobile = () => {
        return (
            <GroupedTasksMobile
                board={board}
                groupedTasks={groups}
                users={collaborators}
                onClickUpdateBlock={onClickUpdateBlock}
            />
        );
    };

    return (
        <RenderForDevice
            renderForMobile={renderGroupedTasksMobile}
            renderForDesktop={renderGroupedTasksDesktop}
        />
    );
};

export default Sprints;
