import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Dropdown, Menu, message, Modal, Space } from "antd";
import { noop } from "lodash";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { useDispatch } from "react-redux";
import {
    BlockPriority,
    IBlock,
    IBlockLabel,
    IBlockStatus,
    IBoardTaskResolution,
} from "../../models/block/block";
import { IUser } from "../../models/user/user";
import OperationActions from "../../redux/operations/actions";
import { deleteBlockOperationAction } from "../../redux/operations/block/deleteBlock";
import { AppDispatch } from "../../redux/types";
import BoardStatusResolutionAndLabelsForm, {
    BoardStatusResolutionAndLabelsFormType,
} from "../board/BoardStatusResolutionAndLabelsForm";
import { getOperationStats } from "../hooks/useOperation";
import StyledContainer from "../styled/Container";
import Priority from "./Priority";
import TaskLabels from "./TaskLabels";
import TaskNameAndDescription from "./TaskNameAndDescription";
import TaskStatusContainer from "./TaskStatusContainer";
import TaskThumbnailAssignees from "./TaskThumbnailAssignees";
import TaskThumbnailDueDate from "./TaskThumbnailDueDate";
import TaskThumbnailSubTasks from "./TaskThumbnailSubTasks";

const ignoreClassNames = ["ant-typography-expand", "task-menu-dropdown"];

export interface ITaskProps {
    task: IBlock;
    board: IBlock;
    orgUsers: IUser[];
    user: IUser;
    statusList: IBlockStatus[];
    resolutionsList: IBoardTaskResolution[];
    labelList: IBlockLabel[];

    demo?: boolean;
    onEdit?: (task: IBlock) => void;
    onDelete?: (task: IBlock) => void; // TODO: we don't use it
}

// TODO: how do we show thelabels?

const Task: React.FC<ITaskProps> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    const {
        task,
        board,
        onEdit,
        demo,
        statusList,
        orgUsers,
        labelList,
        resolutionsList,
        user,
    } = props;

    const [
        subFormType,
        setSubFormType,
    ] = React.useState<BoardStatusResolutionAndLabelsFormType | null>(null);

    const onSelectAddNewStatus = React.useCallback(() => {
        setSubFormType("status");
    }, []);

    const onSelectAddNewResolution = React.useCallback(() => {
        setSubFormType("resolutions");
    }, []);

    const closeForm = React.useCallback(() => setSubFormType(null), []);

    const onDeleteTask = React.useCallback(() => {
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
    }, [demo, dispatch, task]);

    const menuOnClick = React.useCallback(
        (evt) => {
            switch (evt.key) {
                case "edit":
                    if (onEdit) {
                        onEdit(task);
                    }
                    break;

                case "delete":
                    onDeleteTask();
            }
        },
        [task, onDeleteTask, onEdit]
    );

    const menu = (
        <Menu onClick={menuOnClick}>
            <Menu.Item key="edit" disabled={demo}>
                <EditOutlined />
                Edit Task
            </Menu.Item>
            <Menu.Item key="delete" disabled={demo}>
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
    const contentElem: React.ReactNode[] = [
        <StyledContainer key="header">
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
        </StyledContainer>,
        <StyledContainer
            key="name-and-desc"
            onClick={onClick}
            s={{
                cursor: "pointer",
                flexDirection: "column",
                width: "100%",
            }}
        >
            <TaskNameAndDescription task={task} />
        </StyledContainer>,
        <StyledContainer key="status" onClick={stopPropagation}>
            <TaskStatusContainer
                task={task}
                className="task-status"
                demo={demo}
                statusList={statusList}
                resolutionsList={resolutionsList}
                user={user}
                onSelectAddNewStatus={onSelectAddNewStatus}
                onSelectAddNewResolution={onSelectAddNewResolution}
            />
        </StyledContainer>,
    ];

    if (hasAssignees || task.dueAt) {
        contentElem.push(
            <StyledContainer key="assignees-and-dueAt">
                {task.dueAt && (
                    <StyledContainer s={{ flex: 1, paddingRight: "16px" }}>
                        <TaskThumbnailDueDate
                            task={task}
                            statusList={statusList}
                        />
                    </StyledContainer>
                )}
                {hasAssignees && (
                    <TaskThumbnailAssignees task={task} users={orgUsers} />
                )}
            </StyledContainer>
        );
    }

    if (task.labels && task.labels.length > 0) {
        contentElem.push(
            <TaskLabels
                disabled
                key="labels"
                labelList={labelList}
                user={user}
                labels={task.labels}
                onChange={noop}
                onSelectAddNewLabel={noop}
            />
        );
    }

    if (hasSubTasks) {
        contentElem.push(<TaskThumbnailSubTasks key="subtasks" task={task} />);
    }

    return (
        <StyledContainer s={{ minWidth: "280px", width: "100%" }}>
            {subFormType && (
                <BoardStatusResolutionAndLabelsForm
                    visible
                    block={board}
                    onClose={closeForm}
                    active={subFormType}
                />
            )}
            <Space direction="vertical" style={{ width: "100%" }}>
                {contentElem}
            </Space>
        </StyledContainer>
    );
};

export default React.memo(Task);
