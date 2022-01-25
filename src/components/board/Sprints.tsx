import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { Button, Dropdown, Menu, Tag } from "antd";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { ITask } from "../../models/task/types";
import { indexArray } from "../../utils/utils";
import RenderForDevice from "../RenderForDevice";
import { IAntDMenuEvent } from "../types";
import GroupedTasksDesktop from "./GroupedTasksDesktop";
import GroupedTasksMobile from "./GroupedTasksMobile";
import { ITasksContainerRenderFnProps } from "./TasksContainer";
import { IBoardGroupedTasks } from "./types";
import groupBySprints, { BACKLOG } from "./utils/groupBySprints";

export interface ISprintsProps extends ITasksContainerRenderFnProps {
  sprints: ISprint[];
  onUpdateSprint: (sprintId: string) => void;
  onDeleteSprint: (sprintId: string) => void;
  onStartSprint: (sprintId: string) => void;
  onEndSprint: (sprint: ISprint) => void;
  onClickUpdateTask: (task: ITask) => void;
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
    onUpdateSprint,
    onDeleteSprint,
    onStartSprint,
    onEndSprint,
    onClickUpdateTask: onClickUpdateBlock,
  } = props;

  // TODO: look for ways to make it better
  const groups = groupBySprints(sprints, tasks, board.boardStatuses || []);
  const sprintsMap = indexArray(sprints, { path: "customId" });
  const renderDesktopColumnHeaderOptions = (group: IBoardGroupedTasks) => {
    if (group.id === BACKLOG) {
      return null;
    }

    const sprint = sprintsMap[group.id];
    const isSprintCompleted = !!sprint.endDate;

    if (isSprintCompleted) {
      return null;
    }

    const menuOnClick = (evt: IAntDMenuEvent) => {
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
    const isCurrentSprint = board.currentSprintId === group.id;

    if (isCurrentSprint) {
      items.push(
        <Menu.Item key={SprintMenuOptions.END}>
          <ClockCircleOutlined />
          End Sprint
        </Menu.Item>
      );
    }

    if (!board.currentSprintId && sprint.customId === sprints[0]?.customId) {
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
      <Menu.Item key={SprintMenuOptions.EDIT} disabled={isSprintCompleted}>
        <EditOutlined />
        Edit Sprint
      </Menu.Item>,
      <Menu.Item
        key={SprintMenuOptions.DELETE}
        disabled={isCurrentSprint || isSprintCompleted}
      >
        <DeleteOutlined />
        Delete Sprint
      </Menu.Item>
    );

    const menu = <Menu onClick={menuOnClick}>{items}</Menu>;

    return (
      <React.Fragment>
        {group.id === board.currentSprintId && (
          <Tag color="#7ED321">ongoing</Tag>
        )}
        <Dropdown
          overlay={menu}
          trigger={["click"]}
          placement="bottomRight"
          className="task-menu-dropdown"
        >
          <Button
            icon={<MoreHorizontal style={{ height: "100%" }} />}
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
      </React.Fragment>
    );
  };

  const renderGroupedTasksDesktop = () => {
    return (
      <GroupedTasksDesktop
        {...props}
        groupedTasks={groups}
        onClickUpdateTask={onClickUpdateBlock}
        renderColumnHeaderOptions={renderDesktopColumnHeaderOptions}
        emptyMessage={"Add sprints to begin"}
        groupFieldName="sprint"
      />
    );
  };

  const renderGroupedTasksMobile = () => {
    return (
      <GroupedTasksMobile
        {...props}
        groupedTasks={groups}
        onClickUpdateTask={onClickUpdateBlock}
        emptyMessage={"Add sprints to begin"}
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
