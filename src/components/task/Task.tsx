import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
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
import moment from "moment";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { MoreHorizontal } from "react-feather";
import { useDispatch } from "react-redux";
import {
    BlockPriority,
    IBlock,
    IBlockLabel,
    IBlockStatus,
    IBoardTaskResolution,
} from "../../models/block/block";
import { isTaskInLastStatus } from "../../models/block/utils";
import { ISprint } from "../../models/sprint/types";
import { IUser } from "../../models/user/user";
import { deleteBlockOperationAction } from "../../redux/operations/block/deleteBlock";
import { AppDispatch } from "../../redux/types";
import BoardStatusResolutionAndLabelsForm, {
    BoardStatusResolutionAndLabelsFormType,
} from "../board/BoardStatusResolutionAndLabelsForm";
import { getOpData } from "../hooks/useOperation";
import SprintFormInDrawer from "../sprint/SprintFormInDrawer";
import StyledContainer from "../styled/Container";
import Priority from "./Priority";
import TaskNameAndDescription from "./TaskNameAndDescription";
import TaskSubTasksContainer from "./TaskSubTasksContainer";
import TaskThumbnailAssignees from "./TaskThumbnailAssignees";
import TaskThumbnailDueDate from "./TaskThumbnailDueDate";

const clickIgnoreElemsWithClassNames = [
    "ant-typography-expand",
    "task-menu-dropdown",
];

export interface ITaskProps {
    index: number;
    task: IBlock;
    board: IBlock;
    collaborators: IUser[];
    user: IUser;
    statusList: IBlockStatus[];
    resolutionsList: IBoardTaskResolution[];
    labelList: IBlockLabel[];
    labelsMap: { [key: string]: IBlockLabel };
    sprints: ISprint[];
    sprintsMap: { [key: string]: ISprint };
    statusMap: { [key: string]: IBlockStatus };
    resolutionsMap: { [key: string]: IBoardTaskResolution };

    demo?: boolean;
    style?: React.CSSProperties;
    disableDragAndDrop?: boolean;
    onEdit?: (task: IBlock) => void;
    onDelete?: (task: IBlock) => void; // TODO: we don't use it
}

const getItemStyle = (isDragging, draggableStyle, extraStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",

    // change background colour if dragging
    background: isDragging ? "white" : "inherit",

    // styles we need to apply on draggables
    ...draggableStyle,
});

const classes = {
    root: css({
        minWidth: "280px",
        width: "100%",
        borderRadius: "4px",
        border: "1px solid rgb(223, 234, 240)",
        padding: "8px",
        boxShadow: "0 1px 1px -1px #F4F5F7, 0 1px 1px 0 #F4F5F7",
        userSelect: "none",
        // lineHeight: "1.25",
    }),
    middledot: css({
        padding: "0px 8px",
        fontSize: "16px",
    }),
};

const Task: React.FC<ITaskProps> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    const {
        task,
        index,
        board,
        demo,
        statusList,
        collaborators,
        labelList,
        labelsMap,
        resolutionsList,
        user,
        sprints,
        sprintsMap,
        statusMap,
        resolutionsMap,
        style,
        disableDragAndDrop,
        onEdit,
    } = props;

    const [subFormType, setSubFormType] =
        React.useState<BoardStatusResolutionAndLabelsFormType | null>(null);

    const [showSprintForm, setShowSprintForm] = React.useState<boolean>(false);

    const toggleShowSprintForm = React.useCallback(() => {
        setShowSprintForm(!showSprintForm);
    }, [showSprintForm]);

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
                    deleteBlockOperationAction({
                        blockId: task.customId,
                        deleteOpOnComplete: true,
                    })
                );
                const op = unwrapResult(result);

                if (!op) {
                    return;
                }

                const opData = getOpData(op);

                if (opData.isCompleted) {
                    message.success("Task deleted successfully");
                } else if (opData.isError) {
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
            clickIgnoreElemsWithClassNames.findIndex((className) => {
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

    const hasAssignees = task.assignees && task.assignees.length > 0;
    const isInLastStatus = isTaskInLastStatus(task, statusList);
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
    ];

    contentElem.push(
        // separated by middledot
        <div key="dueAt">
            {statusList.length > 0 && task.statusAssignedAt && (
                <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
                    In status since {moment(task.statusAssignedAt).fromNow()}
                </Typography.Text>
            )}
            {task.dueAt && !isInLastStatus ? (
                <div style={{ display: "inline-block" }}>
                    <span className={classes.middledot}>&#xB7;</span>
                    <TaskThumbnailDueDate
                        isInLastStatus={isInLastStatus}
                        task={task}
                    />
                </div>
            ) : null}
        </div>
    );

    if (hasAssignees || task.dueAt) {
        contentElem.push(
            <StyledContainer key="assignees-and-dueAt">
                {hasAssignees && (
                    <TaskThumbnailAssignees task={task} users={collaborators} />
                )}
            </StyledContainer>
        );
    }

    if (hasSubTasks) {
        contentElem.push(
            <TaskSubTasksContainer key="subtasks" user={user} task={task} />
        );
    }

    const rootContent = (
        <React.Fragment>
            {subFormType && (
                <BoardStatusResolutionAndLabelsForm
                    visible
                    block={board}
                    onClose={closeForm}
                    active={subFormType}
                />
            )}
            {showSprintForm && (
                <SprintFormInDrawer
                    visible
                    board={board}
                    onClose={toggleShowSprintForm}
                />
            )}
            <Space direction="vertical" style={{ width: "100%" }}>
                {contentElem}
            </Space>
        </React.Fragment>
    );

    if (disableDragAndDrop) {
        return (
            <div style={style} className={classes.root}>
                {rootContent}
            </div>
        );
    }

    return (
        <Draggable
            key={task.customId}
            draggableId={task.customId}
            index={index}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        style
                    )}
                    className={classes.root}
                >
                    {rootContent}
                </div>
            )}
        </Draggable>
    );
};

export default React.memo(Task);
