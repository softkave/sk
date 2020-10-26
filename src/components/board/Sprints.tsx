import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { Button, Dropdown, Menu } from "antd";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { IUser } from "../../models/user/user";
import { indexArray } from "../../utils/utils";
import RenderForDevice from "../RenderForDevice";
import GroupedTasksDesktop from "./GroupedTasksDesktop";
import GroupedTasksMobile from "./GroupedTasksMobile";
import { IBoardGroupedTasks } from "./types";
import groupBySprints, { BACKLOG } from "./utils/groupBySprints";

export interface ISprintsProps {
    board: IBlock;
    sprints: ISprint[];
    tasks: IBlock[];
    collaborators: IUser[];
    onUpdateSprint: (sprintId: string) => void;
    onDeleteSprint: (sprintId: string) => void;
    onStartSprint: (sprintId: string) => void;
    onEndSprint: (sprint: ISprint) => void;
    onClickUpdateBlock: (block: IBlock) => void;
}

enum SprintMenuOptions {
    EDIT = "EDIT",
    DELETE = "DELETE",
    START = "START",
    END = "END",
}

const Sprints: React.FC<ISprintsProps> = (props) => {
    const {
        board,
        sprints,
        tasks,
        collaborators,
        onUpdateSprint,
        onDeleteSprint,
        onStartSprint,
        onEndSprint,
        onClickUpdateBlock,
    } = props;

    // TODO: look for ways to make it better
    const groups = groupBySprints(sprints, tasks, board.boardStatuses || []);

    const currentSprintIndex = board.currentSprintId
        ? sprints.findIndex(
              (sprint) => sprint.customId === board.currentSprintId
          )
        : -1;

    const sprintsMap = indexArray(sprints, { path: "customId" });

    const renderDesktopColumnHeaderOptions = (group: IBoardGroupedTasks) => {
        if (group.id === BACKLOG) {
            return null;
        }

        const sprint = sprintsMap[group.id];

        if (sprint.endDate) {
            return null;
        }

        const menuOnClick = (evt) => {
            switch (evt.key) {
                case SprintMenuOptions.EDIT:
                    onUpdateSprint(group.id);
                    break;

                case SprintMenuOptions.DELETE:
                    onDeleteSprint(group.id);
                    break;

                case SprintMenuOptions.START:
                    onStartSprint(group.id);
                    break;

                case SprintMenuOptions.END:
                    onEndSprint(sprint);
                    break;
            }
        };

        const items: React.ReactNode[] = [];

        if (board.currentSprintId === group.id) {
            items.push(
                <Menu.Item key={SprintMenuOptions.END}>
                    <ClockCircleOutlined />
                    End Sprint
                </Menu.Item>
            );
        }

        if (
            !board.currentSprintId &&
            sprint.sprintIndex === currentSprintIndex + 1
        ) {
            items.push(
                <Menu.Item key={SprintMenuOptions.START}>
                    <ClockCircleOutlined />
                    Start Sprint
                </Menu.Item>
            );
        }

        if (items.length > 0) {
            items.push(<Menu.Divider key="divider" />);
        }

        items.push(
            <Menu.Item key={SprintMenuOptions.EDIT}>
                <EditOutlined />
                Edit Sprint
            </Menu.Item>,
            <Menu.Item key={SprintMenuOptions.DELETE}>
                <DeleteOutlined />
                Delete Sprint
            </Menu.Item>
        );

        const menu = <Menu onClick={menuOnClick}>{items}</Menu>;

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
