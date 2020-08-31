import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import {
    Button,
    Dropdown,
    Menu,
    message,
    Modal,
    Space,
    Typography,
} from "antd";
import { noop } from "lodash";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { useDispatch } from "react-redux";
import { BlockPriority, IBlock, IBlockStatus } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import OperationActions from "../../redux/operations/actions";
import { deleteBlockOperationAction } from "../../redux/operations/block/deleteBlock";
import { AppDispatch } from "../../redux/types";
import { getOperationStats } from "../hooks/useOperation";
import StyledContainer from "../styled/Container";
import Priority from "./Priority";
import TaskLabelContainer from "./TaskLabelContainer";
import TaskStatusContainer from "./TaskStatusContainer";
import TaskThumbnailAssignees from "./TaskThumbnailAssignees";
import TaskThumbnailDueDate from "./TaskThumbnailDueDate";
import TaskThumbnailSubTasks from "./TaskThumbnailSubTasks";

const ignoreClassNames = ["ant-typography-expand", "task-menu-dropdown"];

export interface ITaskProps {
    task: IBlock;
    orgUsers: IUser[];

    demo?: boolean;
    statusList?: IBlockStatus[];
    onEdit?: (task: IBlock) => void;
    onDelete?: (task: IBlock) => void; // TODO: we don't use it
}

// TODO: how do we show thelabels?

const Task: React.FC<ITaskProps> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    const { task, onEdit, demo, statusList, orgUsers } = props;

    const onDeleteTask = () => {
        if (demo) {
            return;
        }

        // TODO: should we show loading when deleting or cover the task with a mask?
        Modal.confirm({
            title: "Are you sure you want to delete this task?",
            okText: "Yes",
            cancelText: "No",
            okType: "primary",
            okButtonProps: { danger: true },
            onOk: async () => {
                const result = await dispatch(
                    deleteBlockOperationAction({ block: task })
                );
                const op = unwrapResult(result);

                if (!op) {
                    return;
                }

                const opStat = getOperationStats(op);

                if (opStat.isCompleted) {
                    message.success("Task deleted successfully");
                    dispatch(OperationActions.deleteOperation(op.id));
                } else if (opStat.isError) {
                    message.error("Error deleting task");
                }
            },
            onCancel() {
                // do nothing
            },
        });
    };

    const menu = (
        <Menu
            onClick={(evt) => {
                switch (evt.key) {
                    case "edit":
                        if (onEdit) {
                            onEdit(task);
                        }
                        break;

                    case "delete":
                        onDeleteTask();
                }
            }}
        >
            <Menu.Item key="edit">
                <EditOutlined />
                Edit Task
            </Menu.Item>
            <Menu.Item key="delete">
                <DeleteOutlined />
                Delete Task
            </Menu.Item>
        </Menu>
    );

    const options = (
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

    const onClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        const target = evt.target as HTMLElement;
        const shouldIgnore =
            ignoreClassNames.findIndex((className) => {
                if (target.classList.contains(className)) {
                    return true;
                }

                return false;
            }) !== -1;

        if (shouldIgnore) {
            return;
        }

        if (onEdit) {
            onEdit(task);
        }
    };

    const stopPropagation = (evt: React.MouseEvent<HTMLDivElement>) => {
        evt.stopPropagation();
    };

    const hasAssignees = task.assignees && task.assignees.length > 0;
    const hasSubTasks = task.subTasks && task.subTasks.length > 0;

    return (
        <StyledContainer s={{ minWidth: "280px", width: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
                <StyledContainer>
                    <StyledContainer s={{ flex: 1 }}>
                        <Priority level={task.priority as BlockPriority} />
                    </StyledContainer>
                    <StyledContainer
                        onClick={(evt) => {
                            evt.stopPropagation();
                        }}
                    >
                        {options}
                    </StyledContainer>
                </StyledContainer>
                <StyledContainer
                    onClick={onClick}
                    s={{
                        cursor: "pointer",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    <Space direction="vertical">
                        {task.name && (
                            <Typography.Paragraph style={{ marginBottom: "0" }}>
                                {task.name}
                            </Typography.Paragraph>
                        )}
                        {task.description && (
                            <Typography.Paragraph
                                type={"secondary"}
                                ellipsis={{
                                    rows: 2,
                                    expandable: true,
                                }}
                                style={{ marginBottom: "0" }}
                            >
                                {task.description}
                            </Typography.Paragraph>
                        )}
                    </Space>
                </StyledContainer>
                <StyledContainer>
                    <StyledContainer onClick={stopPropagation}>
                        <TaskStatusContainer
                            task={task}
                            className="task-status"
                            demo={demo}
                            statusList={statusList}
                        />
                    </StyledContainer>
                </StyledContainer>
                {(hasAssignees || task.dueAt) && (
                    <StyledContainer>
                        {task.dueAt && (
                            <StyledContainer
                                s={{ flex: 1, paddingRight: "16px" }}
                            >
                                <TaskThumbnailDueDate task={task} />
                            </StyledContainer>
                        )}
                        {hasAssignees && (
                            <TaskThumbnailAssignees
                                task={task}
                                users={orgUsers}
                            />
                        )}
                    </StyledContainer>
                )}
                <TaskLabelContainer disabled onChange={noop} task={task} />
                {hasSubTasks && <TaskThumbnailSubTasks task={task} />}
            </Space>
        </StyledContainer>
    );
};

export default React.memo(Task);
