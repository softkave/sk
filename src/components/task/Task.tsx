import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Dropdown, Menu, Modal, Space, Tag } from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import moment from "moment";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { MoreHorizontal } from "react-feather";
import { useDispatch } from "react-redux";
import {
  IBoard,
  IBoardLabel,
  IBoardStatus,
  IBoardStatusResolution,
} from "../../models/board/types";
import { ICollaborator } from "../../models/collaborator/types";
import { ISprint } from "../../models/sprint/types";
import { ITask, TaskPriority } from "../../models/task/types";
import { isTaskInLastStatus } from "../../models/task/utils";
import { IUser } from "../../models/user/types";
import { deleteTaskOpAction } from "../../redux/operations/task/deleteTask";
import { AppDispatch } from "../../redux/types";
import BoardStatusResolutionAndLabelsForm, {
  BoardStatusResolutionAndLabelsFormType,
} from "../board/BoardStatusResolutionAndLabelsForm";
import SprintFormInDrawer from "../sprint/SprintFormInDrawer";
import handleOpResult from "../utils/handleOpResult";
import Priority from "./Priority";
import TaskLabelList from "./TaskLabelList";
import TaskNameAndDescription from "./TaskNameAndDescription";
import TaskSubTasksContainer from "./TaskSubTasksContainer";
import TaskThumbnailAssignees from "./TaskThumbnailAssignees";
import TaskThumbnailDueDate from "./TaskThumbnailDueDate";

const clickIgnoreElemsWithClassNames = ["ant-typography-expand", "task-menu-dropdown"];

export interface ITaskProps {
  index: number;
  task: ITask;
  board: IBoard;
  collaborators: ICollaborator[];
  user: IUser;
  statusList: IBoardStatus[];
  resolutionsList: IBoardStatusResolution[];
  labelList: IBoardLabel[];
  labelsMap: { [key: string]: IBoardLabel };
  sprints: ISprint[];
  sprintsMap: { [key: string]: ISprint };
  statusMap: { [key: string]: IBoardStatus };
  resolutionsMap: { [key: string]: IBoardStatusResolution };
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
    userSelect: "none",

    "@media (min-width: 400px)": {
      width: "320px",
    },
  }),
  middledot: css({
    padding: "0px 8px",
    fontSize: "16px",
  }),
  assigneesWrapper: css({
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
    labelsMap,
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
          })
        );
        handleOpResult({
          result,
          successMessage: "Task deleted",
          errorMessage: "Error deleting task",
        });
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

  // TODO: auth checks
  const canUpdateTask = true;
  const canDeleteTask = true;

  const menuItems: MenuItemType[] = [];
  if (canUpdateTask) {
    menuItems.push({
      label: "Edit Task",
      key: "edit",
      icon: <EditOutlined />,
      disabled: demo,
    });
  }

  if (canDeleteTask) {
    menuItems.push({
      label: "Delete Task",
      key: "delete",
      icon: <DeleteOutlined />,
      disabled: demo,
    });
  }

  const menuNode = menuItems.length > 0 ? <Menu onClick={menuOnClick} items={menuItems} /> : null;
  const optionsNode = menuNode && (
    <Dropdown
      overlay={menuNode}
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
  const hasSubTasks = task.subTasks && task.subTasks.length > 0;
  const contentElem: React.ReactNode[] = [
    <div key="header" style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <Priority level={task.priority as TaskPriority} />
      </div>
      <div style={{ display: "flex" }}>{optionsNode}</div>
    </div>,
    <TaskNameAndDescription
      key="name-and-desc"
      onClick={onClick}
      style={{
        cursor: "pointer",
        flexDirection: "column",
        width: "100%",
      }}
      task={task}
    />,
  ];

  const hasStatus = statusList.length > 0 && task.statusAssignedAt;
  const isInLastStatus = isTaskInLastStatus(task, statusList);
  const hasDueDate = task.dueAt && !isInLastStatus;

  if (hasStatus || hasDueDate) {
    contentElem.push(
      <Space
        wrap
        size={[0, 4]}
        key="dueAt"
        // style={{ lineHeight: "18px", marginBottom: "6px" }}
      >
        {hasStatus && <Tag>In status since {moment(task.statusAssignedAt).fromNow()}</Tag>}
        {hasDueDate ? <TaskThumbnailDueDate isInLastStatus={isInLastStatus} task={task} /> : null}
      </Space>
    );
  }

  if (task.labels.length > 0) {
    contentElem.push(
      <div key="labels" className={classes.assigneesWrapper}>
        <TaskLabelList labelsMap={labelsMap} labels={task.labels} />
      </div>
    );
  }

  if (hasAssignees) {
    contentElem.push(
      <div key="assignees" className={classes.assigneesWrapper}>
        <TaskThumbnailAssignees task={task} users={collaborators} />
      </div>
    );
  }

  if (hasSubTasks) {
    contentElem.push(<TaskSubTasksContainer key="subtasks" user={user} task={task} />);
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
        <SprintFormInDrawer visible board={board} onClose={toggleShowSprintForm} />
      )}
      <Space direction="vertical" style={{ width: "100%" }} size={10}>
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
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, style)}
          className={classes.root}
        >
          {rootContent}
        </div>
      )}
    </Draggable>
  );
};

export default React.memo(Task);
