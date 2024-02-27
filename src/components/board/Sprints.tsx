import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { Dropdown, Menu, Tag } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { ISprint } from "../../models/sprint/types";
import { ITask } from "../../models/task/types";
import { indexArray } from "../../utils/utils";
import RenderForDevice from "../RenderForDevice";
import CustomIcon from "../utils/buttons/CustomIcon";
import IconButton from "../utils/buttons/IconButton";
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

  // TODO: auth check
  const canUpdateSprint = true;
  const canDeleteSprint = true;

  const renderDesktopColumnHeaderOptions = (group: IBoardGroupedTasks) => {
    if (group.id === BACKLOG) {
      return null;
    }

    const sprint = sprintsMap[group.id];
    const isSprintCompleted = !!sprint.endDate;
    if (isSprintCompleted) {
      return null;
    }

    const menuOnClick = (evt: { key: string }) => {
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

    const isCurrentSprint = board.currentSprintId === group.id;
    const menuItems: ItemType[] = [];

    if (isCurrentSprint && canUpdateSprint) {
      menuItems.push({
        label: "End Sprint",
        key: SprintMenuOptions.END,
        icon: <ClockCircleOutlined />,
      });
    }

    if (!board.currentSprintId && sprint.customId === sprints[0]?.customId && canUpdateSprint) {
      menuItems.push({
        label: "Start Sprint",
        key: SprintMenuOptions.START,
        icon: <ClockCircleOutlined />,
      });
    }

    if (canUpdateSprint) {
      menuItems.push({
        label: "Edit Sprint",
        key: SprintMenuOptions.EDIT,
        icon: <EditOutlined />,
      });
    }

    if (canDeleteSprint) {
      menuItems.push({
        label: "Delete Sprint",
        key: SprintMenuOptions.DELETE,
        icon: <DeleteOutlined />,
        disabled: isCurrentSprint || isSprintCompleted,
      });
    }

    const menuNode = menuItems.length > 0 ? <Menu onClick={menuOnClick} items={menuItems} /> : null;
    const dropdownNode = menuNode && (
      <Dropdown
        overlay={menuNode}
        trigger={["click"]}
        placement="bottomRight"
        className="task-menu-dropdown"
      >
        <IconButton icon={<CustomIcon icon={<FiMoreHorizontal style={{ height: "100%" }} />} />} />
      </Dropdown>
    );

    return (
      <React.Fragment>
        {group.id === board.currentSprintId && <Tag color="#7ED321">ongoing</Tag>}
        {dropdownNode}
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
