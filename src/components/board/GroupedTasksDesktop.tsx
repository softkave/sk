import { css, cx } from "@emotion/css";
import { Badge, Space, Typography } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";
import {
  BeforeCapture,
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from "react-beautiful-dnd";
import {
  IBlockAssignedLabel,
  IFormBlock,
  ITaskAssignee,
} from "../../models/block/block";
import { ITask } from "../../models/task/types";
import { getDateString } from "../../utils/utils";
import Message from "../Message";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import Column from "./Column";
import { ITasksContainerRenderFnProps } from "./TasksContainer";
import { BoardGroupableFields, IBoardGroupedTasks } from "./types";
import { NO_ASSIGNEES_TEXT } from "./utils/groupByAssignees";
import { NO_LABEL_TEXT } from "./utils/groupByLabels";
import { BACKLOG } from "./utils/groupBySprints";
import { NO_STATUS_TEXT } from "./utils/groupByStatus";

export interface IGroupedTasksDesktopProps
  extends ITasksContainerRenderFnProps {
  groupedTasks: IBoardGroupedTasks[];
  groupFieldName: BoardGroupableFields;
  onClickUpdateTask: (task: ITask) => void;
  renderColumnHeaderOptions?: (group: IBoardGroupedTasks) => React.ReactNode;
  emptyMessage?: string;
}

interface IDragStateInfo {
  draggableId: string;
  groupId?: string;
}

const getListStyle = (
  isDragging: boolean,
  isDraggingOver: boolean,
  isParentGroup: boolean
): React.CSSProperties => ({
  height: "100%",
  background: isDragging
    ? isParentGroup
      ? "inherit"
      : isDraggingOver
      ? "#DEEBFF"
      : "#E3FCEF"
    : undefined,
  flex: 1,
});

const classes = {
  dragStateDroppableDiv: css({
    background: "#E3FCEF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
  }),
  dragStateDroppableContentText: css({
    fontSize: "16px !important",
    textTransform: "capitalize",
  }),
  column: css({
    minWidth: "280px ",
    marginLeft: "16px",
  }),
  lastColumn: css({
    minWidth: `${280 + 16}px !important`,
    marginLeft: "16px",
    paddingRight: "16px",
  }),
};

const GroupedTasksDesktop: React.FC<IGroupedTasksDesktopProps> = (props) => {
  const {
    groupedTasks,
    tasksMap,
    emptyMessage,
    groupFieldName,
    user,
    onClickUpdateTask: onClickUpdateBlock,
    renderColumnHeaderOptions,
    onUpdateTask,
  } = props;

  const [dragInfo, setDragInfo] = React.useState<IDragStateInfo | null>(null);

  const renderColumnHeader = (group: IBoardGroupedTasks) => {
    const defaultContent = (
      <Space>
        {group.color && (
          <Avatar
            shape="square"
            size="small"
            style={{ backgroundColor: group.color }}
          />
        )}
        <Typography.Text
          strong
          style={{
            textTransform: "uppercase",
          }}
        >
          {group.name}
        </Typography.Text>
        <Badge
          count={group.tasks.length}
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        />
      </Space>
    );

    let content: React.ReactNode = defaultContent;

    if (renderColumnHeaderOptions) {
      content = (
        <React.Fragment>
          <StyledContainer s={{ flex: 1 }}>{defaultContent}</StyledContainer>
          {renderColumnHeaderOptions(group)}
        </React.Fragment>
      );
    }

    return content;
  };

  const renderDroppableContent = (
    group: IBoardGroupedTasks,
    provided: DroppableProvided,
    snapshot: DroppableStateSnapshot
  ) => {
    let shouldRenderGroup = false;

    if (dragInfo) {
      shouldRenderGroup = dragInfo.groupId === group.id;
    } else {
      shouldRenderGroup = true;
    }

    return shouldRenderGroup ? (
      <div
        ref={provided.innerRef}
        style={getListStyle(
          !!dragInfo,
          snapshot.isDraggingOver,
          shouldRenderGroup
        )}
        {...provided.droppableProps}
      >
        <TaskList
          {...props}
          tasks={group.tasks}
          toggleForm={onClickUpdateBlock}
          style={{ height: "100%" }}
        />
        {provided.placeholder}
      </div>
    ) : (
      <div
        ref={provided.innerRef}
        style={getListStyle(
          !!dragInfo,
          snapshot.isDraggingOver,
          shouldRenderGroup
        )}
        className={classes.dragStateDroppableDiv}
        {...provided.droppableProps}
      >
        {provided.placeholder}
      </div>
    );
  };

  const renderColumn = (group: IBoardGroupedTasks, i: number) => {
    return (
      <Column
        key={group.id}
        header={renderColumnHeader(group)}
        body={
          <Droppable droppableId={group.id}>
            {(provided, snapshot) =>
              renderDroppableContent(group, provided, snapshot)
            }
          </Droppable>
        }
        className={cx(classes.column, {
          [classes.lastColumn]: i === groupedTasks.length - 1,
        })}
      />
    );
  };

  const onBeforeCapture = React.useCallback(
    (before: BeforeCapture) => {
      const task = tasksMap[before.draggableId];
      const value = task[groupFieldName];
      const groupIdentifierMap: Record<string, string> = {};
      let emptyGroupId = "";

      switch (groupFieldName) {
        case "assignees": {
          const assignees = (value || []) as ITaskAssignee[];
          assignees.forEach((assignee) => {
            groupIdentifierMap[assignee.userId] = assignee.userId;
          });

          emptyGroupId = NO_ASSIGNEES_TEXT;
          break;
        }

        case "labels": {
          const labels = (value || []) as IBlockAssignedLabel[];
          labels.forEach((item) => {
            groupIdentifierMap[item.customId] = item.customId;
          });

          emptyGroupId = NO_LABEL_TEXT;
          break;
        }

        case "status": {
          const status = value as string;

          if (status) {
            groupIdentifierMap[status] = status;
          }

          emptyGroupId = NO_STATUS_TEXT;
          break;
        }

        case "sprint": {
          const sprintId = value as string;

          if (sprintId) {
            groupIdentifierMap[sprintId] = sprintId;
          }

          emptyGroupId = BACKLOG;
          break;
        }
      }

      const group = groupedTasks.find((item) => groupIdentifierMap[item.id]);

      setDragInfo({
        draggableId: before.draggableId,
        groupId: group?.id || emptyGroupId,
      });
    },
    [groupFieldName, groupedTasks, tasksMap]
  );

  const onDragEnd = React.useCallback(
    (result: DropResult, provided) => {
      const taskId = result.draggableId;
      const task = tasksMap[taskId];

      if (!result.destination) {
        return;
      }

      const destinationId = result.destination.droppableId;
      const update: Partial<IFormBlock> = {};

      switch (groupFieldName) {
        case "assignees": {
          const assignee: ITaskAssignee = {
            userId: destinationId,
            assignedAt: getDateString(),
            assignedBy: user.customId,
          };

          update.assignees = (task.assignees || []).concat(assignee);
          break;
        }

        case "labels": {
          const label: IBlockAssignedLabel = {
            customId: destinationId,
            assignedBy: user.customId,
            assignedAt: getDateString(),
          };

          update.labels = (task.labels || []).concat(label);
          break;
        }

        case "status": {
          update.status = destinationId;
          break;
        }

        case "sprint": {
          update.taskSprint = {
            sprintId: destinationId,
          };

          break;
        }
      }

      onUpdateTask(taskId, update);
      setDragInfo(null);
    },
    [groupFieldName, onUpdateTask, tasksMap, user.customId]
  );

  const renderGroups = () => {
    return groupedTasks.map((group, i) => renderColumn(group, i));
  };

  if (groupedTasks.length === 0) {
    return <Message message={emptyMessage || "Board is empty."} />;
  }

  return (
    <DragDropContext onBeforeCapture={onBeforeCapture} onDragEnd={onDragEnd}>
      <StyledContainer
        s={{
          overflowX: "auto",
          width: "100%",
          flex: 1,
          marginTop: "22px",
        }}
      >
        {renderGroups()}
      </StyledContainer>
    </DragDropContext>
  );
};

export default GroupedTasksDesktop;
