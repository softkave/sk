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
  IBlockLabel,
  IBlockStatus,
  IBoardTaskResolution,
} from "../../models/block/block";
import { isTaskInLastStatus } from "../../models/block/utils";
import { IBoard } from "../../models/board/types";
import { ICollaborator } from "../../models/collaborator/types";
import { ISprint } from "../../models/sprint/types";
import { ITask } from "../../models/task/types";
import { IUser } from "../../models/user/user";
import { deleteTaskOpAction } from "../../redux/operations/task/deleteTask";
import { AppDispatch } from "../../redux/types";
import BoardStatusResolutionAndLabelsForm, {
  BoardStatusResolutionAndLabelsFormType,
} from "../board/BoardStatusResolutionAndLabelsForm";
import { getOpData } from "../hooks/useOperation";
import SprintFormInDrawer from "../sprint/SprintFormInDrawer";
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
  task: ITask;
  board: IBoard;
  collaborators: ICollaborator[];
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
  onEdit?: (task: ITask) => void;
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
    minWidth: "320px",
    width: "100%",
    borderRadius: "6px",
    border: "2px solid #f0f0f0",
    padding: "8px",
    // boxShadow: "0 1px 1px -1px #F4F5F7, 0 1px 1px 0 #F4F5F7",
    userSelect: "none",

    "@media (min-width: 400px)": {
      width: "320px",
    },
  }),
  middledot: css({
    padding: "0px 8px",
    fontSize: "16px",
  }),
  dueDateWrapper: css({
    lineHeight: 0,
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
    user,
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
          deleteTaskOpAction({
            taskId: task.customId,
            deleteOpOnComplete: true,
          })
        );
        const op = unwrapResult(result);

        if (!op) {
          return;
        }

        const opData = getOpData(op);

        if (opData.isCompleted) {
          message.success("Task deleted.");
        } else if (opData.isError) {
          message.error("Error deleting task.");
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
      <Menu.Item key="edit" disabled={demo} icon={<EditOutlined />}>
        Edit Task
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" disabled={demo} icon={<DeleteOutlined />}>
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
    <div key="header" style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <Priority level={task.priority as BlockPriority} />
      </div>
      <div
        onClick={(evt) => {
          evt.stopPropagation();
        }}
        style={{ display: "flex" }}
      >
        {options}
      </div>
    </div>,
    <div
      key="name-and-desc"
      onClick={onClick}
      style={{
        cursor: "pointer",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <TaskNameAndDescription task={task} />
    </div>,
  ];

  const hasStatus = statusList.length > 0 && task.statusAssignedAt;
  const hasDueDate = task.dueAt && !isInLastStatus;

  if (hasStatus || hasDueDate) {
    contentElem.push(
      // separated by middledot
      <Space
        wrap
        size={[4, 0]}
        key="dueAt"
        split={<span className={classes.middledot}>&#xB7;</span>}
        style={{ lineHeight: "18px", marginBottom: "6px" }}
      >
        {hasStatus && (
          <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
            In status since {moment(task.statusAssignedAt).fromNow()}
          </Typography.Text>
        )}
        {hasDueDate ? (
          <TaskThumbnailDueDate isInLastStatus={isInLastStatus} task={task} />
        ) : null}
      </Space>
    );
  }

  if (hasAssignees || task.dueAt) {
    contentElem.push(
      <div key="assignees-and-dueAt" className={classes.dueDateWrapper}>
        {hasAssignees && (
          <TaskThumbnailAssignees task={task} users={collaborators} />
        )}
      </div>
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
          board={board}
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
      <Space direction="vertical" style={{ width: "100%" }} size={8}>
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
    <Draggable key={task.customId} draggableId={task.customId} index={index}>
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
