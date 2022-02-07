import { EditOutlined } from "@ant-design/icons";
import { Checkbox, Menu, Space } from "antd";
import React from "react";
import { Clock, MoreHorizontal, Plus, Search, Trash2 } from "react-feather";
import { IBoard } from "../../models/board/types";
import StyledContainer from "../styled/Container";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";

export enum BoardHeaderSettingsMenuKey {
  EDIT = "edit",
  DELETE = "delete",
  EDIT_STATUS = "edit-status",
  EDIT_LABELS = "edit-labels",
  EDIT_RESOLUTIONS = "edit-resolutions",
  ADD_TASK = "add-task",
  SEARCH_TASKS = "search-tasks",
  SETUP_SPRINTS = "setup-sprints",
  ADD_SPRINT = "add-sprint",
  END_SPRINT = "end-sprint",
}

export enum BoardCurrentView {
  CURRENT_SPRINT = "current-sprint",
  ALL_TASKS = "all-tasks",
  SPRINTS = "sprints",
}

export enum BoardGroupBy {
  STATUS = "status",
  LABELS = "labels",
  ASSIGNEES = "assignees",
  SPRINT = "sprint",
}

export interface IBoardHeaderOptionsMenuProps {
  block: IBoard;
  view: BoardCurrentView;
  groupBy: BoardGroupBy;
  onSelectMenuKey: (key: BoardHeaderSettingsMenuKey) => void;
  onSelectCurrentView: (key: BoardCurrentView) => void;
  onSelectGroupBy: (key: BoardGroupBy) => void;
}

const BoardHeaderOptionsMenu: React.FC<IBoardHeaderOptionsMenuProps> = (
  props
) => {
  const {
    block,
    view,
    groupBy,
    onSelectMenuKey,
    onSelectCurrentView,
    onSelectGroupBy,
  } = props;

  const renderTrigger = React.useCallback(
    (renderTriggerProps: IMenuWithTriggerRenderTriggerProps) => {
      return (
        <StyledContainer
          s={{
            cursor: "pointer",
            textTransform: "capitalize",
          }}
          onClick={renderTriggerProps.openMenu}
        >
          <MoreHorizontal />
        </StyledContainer>
      );
    },
    []
  );

  const internalOnSelect = (
    key: BoardHeaderSettingsMenuKey | BoardCurrentView | BoardGroupBy
  ) => {
    switch (key) {
      case BoardHeaderSettingsMenuKey.EDIT:
      case BoardHeaderSettingsMenuKey.DELETE:
      case BoardHeaderSettingsMenuKey.EDIT_STATUS:
      case BoardHeaderSettingsMenuKey.EDIT_LABELS:
      case BoardHeaderSettingsMenuKey.EDIT_RESOLUTIONS:
      case BoardHeaderSettingsMenuKey.ADD_TASK:
      case BoardHeaderSettingsMenuKey.SEARCH_TASKS:
      case BoardHeaderSettingsMenuKey.SETUP_SPRINTS:
      case BoardHeaderSettingsMenuKey.ADD_SPRINT:
      case BoardHeaderSettingsMenuKey.END_SPRINT:
        onSelectMenuKey(key as BoardHeaderSettingsMenuKey);
        break;

      case BoardCurrentView.CURRENT_SPRINT:
      case BoardCurrentView.ALL_TASKS:
      case BoardCurrentView.SPRINTS:
        onSelectCurrentView(key as BoardCurrentView);
        break;

      case BoardGroupBy.STATUS:
      case BoardGroupBy.LABELS:
      case BoardGroupBy.ASSIGNEES:
        onSelectGroupBy(key as BoardGroupBy);
        break;
    }
  };

  const boardHasSprintsSetup = !!block.sprintOptions;

  const renderViewMenuItems = () => {
    const items: React.ReactNode[] = [
      <Menu.Item
        key={BoardCurrentView.CURRENT_SPRINT}
        disabled={!block.currentSprintId}
      >
        <Space align="center" size={12}>
          <Checkbox
            checked={view === BoardCurrentView.CURRENT_SPRINT}
            disabled={!block.currentSprintId}
          />
          Current Sprint
        </Space>
      </Menu.Item>,
      <Menu.Item key={BoardCurrentView.ALL_TASKS}>
        <Space align="center" size={12}>
          <Checkbox checked={view === BoardCurrentView.ALL_TASKS} />
          All Tasks
        </Space>
      </Menu.Item>,
      <Menu.Item key={BoardCurrentView.SPRINTS}>
        <Space align="center" size={12}>
          <Checkbox checked={view === BoardCurrentView.SPRINTS} />
          Sprints
        </Space>
      </Menu.Item>,
    ];

    return items;
  };

  const renderGroupByMenuItems = () => {
    const items: React.ReactNode[] = [];

    if (
      view !== BoardCurrentView.CURRENT_SPRINT &&
      view !== BoardCurrentView.ALL_TASKS
    ) {
      return items;
    }

    items.push(
      <Menu.Divider key="group-by-divider" />,
      <Menu.Item key={BoardGroupBy.STATUS}>
        <Space align="center" size={12}>
          <Checkbox checked={groupBy === BoardGroupBy.STATUS} />
          Status
        </Space>
      </Menu.Item>,
      <Menu.Item key={BoardGroupBy.LABELS}>
        <Space align="center" size={12}>
          <Checkbox checked={groupBy === BoardGroupBy.LABELS} />
          Labels
        </Space>
      </Menu.Item>,
      <Menu.Item key={BoardGroupBy.ASSIGNEES}>
        <Space align="center" size={12}>
          <Checkbox checked={groupBy === BoardGroupBy.ASSIGNEES} />
          Assignees
        </Space>
      </Menu.Item>
    );

    return items;
  };

  const renderTaskMenuItems = () => {
    const items: React.ReactNode[] = [
      <Menu.Divider key="tasks-menu-divider" />,
      <Menu.Item key={BoardHeaderSettingsMenuKey.ADD_TASK}>
        <Space align="center" size={12}>
          <Plus style={plusIconStyles} />
          Add Task
        </Space>
      </Menu.Item>,
      <Menu.Item key={BoardHeaderSettingsMenuKey.SEARCH_TASKS}>
        <Space align="center" size={12}>
          <Search style={plusIconStyles} />
          Search Tasks
        </Space>
      </Menu.Item>,
    ];

    return items;
  };

  const renderBoardResourcesMenuItems = () => {
    const items: React.ReactNode[] = [
      <Menu.Divider key="board-resources-divider" />,
    ];

    if (boardHasSprintsSetup) {
      items.push(
        <Menu.Item key={BoardHeaderSettingsMenuKey.ADD_SPRINT}>
          <Space align="center" size={12}>
            <Plus style={plusIconStyles} />
            Sprint
          </Space>
        </Menu.Item>
      );
    }

    items.push(
      <Menu.Item key={BoardHeaderSettingsMenuKey.EDIT_STATUS}>
        <Space align="center" size={12}>
          <Plus style={plusIconStyles} />
          Status
        </Space>
      </Menu.Item>,
      <Menu.Item key={BoardHeaderSettingsMenuKey.EDIT_RESOLUTIONS}>
        <Space align="center" size={12}>
          <Plus style={plusIconStyles} />
          Resolutions
        </Space>
      </Menu.Item>,
      <Menu.Item key={BoardHeaderSettingsMenuKey.EDIT_LABELS}>
        <Space align="center" size={12}>
          <Plus style={plusIconStyles} />
          Labels
        </Space>
      </Menu.Item>
    );

    return items;
  };

  const renderBoardOwnMenuItems = () => {
    const items: React.ReactNode[] = [
      <Menu.Divider key="board-own-items-divider" />,
      <Menu.Item
        style={{ textTransform: "capitalize" }}
        key={BoardHeaderSettingsMenuKey.EDIT}
      >
        <Space align="center" size={12}>
          <EditOutlined />
          <span>Edit {block.type}</span>
        </Space>
      </Menu.Item>,
      <Menu.Item
        style={{ textTransform: "capitalize" }}
        key={BoardHeaderSettingsMenuKey.DELETE}
      >
        <Space align="center" size={12}>
          <Trash2
            style={{
              width: "14px",
              height: "14px",
              verticalAlign: "middle",
              marginTop: "-4px",
            }}
          />
          <span>Delete {block.type}</span>
        </Space>
      </Menu.Item>,
    ];

    if (block.currentSprintId) {
      items.unshift(
        <Menu.Divider key="end-sprint-divider" />,
        <Menu.Item
          style={{ textTransform: "capitalize" }}
          key={BoardHeaderSettingsMenuKey.END_SPRINT}
        >
          <Space align="center" size={12}>
            <Clock style={plusIconStyles} />
            <span>End Sprint</span>
          </Space>
        </Menu.Item>
      );
    }

    if (!boardHasSprintsSetup) {
      items.unshift(
        <Menu.Divider key="setup-sprints-divider" />,
        <Menu.Item key={BoardHeaderSettingsMenuKey.SETUP_SPRINTS}>
          <Space align="center" size={12}>
            <Plus style={plusIconStyles} />
            Setup Sprints
          </Space>
        </Menu.Item>
      );
    }

    return items;
  };

  const renderBlockOptions = (
    renderMenuProps: IMenuWithTriggerRenderMenuProps
  ) => {
    return (
      <Menu
        onClick={(event) => {
          internalOnSelect(event.key as any);
          renderMenuProps.closeMenu();
        }}
      >
        {renderViewMenuItems()}
        {renderGroupByMenuItems()}
        {renderTaskMenuItems()}
        {renderBoardResourcesMenuItems()}
        {renderBoardOwnMenuItems()}
      </Menu>
    );
  };

  return (
    <MenuWithTrigger
      menuType="dropdown"
      renderTrigger={renderTrigger}
      renderMenu={renderBlockOptions}
    />
  );
};

export default BoardHeaderOptionsMenu;

const plusIconStyles: React.CSSProperties = {
  width: "16px",
  height: "16px",
  verticalAlign: "middle",
  marginTop: "-3px",
};
