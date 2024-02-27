import { EditOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Checkbox, Menu, Space } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import React from "react";
import { Clock, MoreHorizontal, Plus, Search, Trash2 } from "react-feather";
import { IBoard } from "../../models/board/types";
import IconButton from "../utils/buttons/IconButton";

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

  AddButton = "add-btn",
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
  board: IBoard;
  view: BoardCurrentView;
  groupBy: BoardGroupBy;
  onSelectMenuKey: (key: BoardHeaderSettingsMenuKey) => void;
  onSelectCurrentView: (key: BoardCurrentView) => void;
  onSelectGroupBy: (key: BoardGroupBy) => void;
}

const BoardHeaderOptionsMenu: React.FC<IBoardHeaderOptionsMenuProps> = (props) => {
  const { board, view, groupBy, onSelectMenuKey, onSelectCurrentView, onSelectGroupBy } = props;

  const renderTrigger = React.useCallback(
    (renderTriggerProps: IMenuWithTriggerRenderTriggerProps) => {
      return (
        <IconButton
          className={css({
            cursor: "pointer",
            textTransform: "capitalize",
          })}
          onClick={renderTriggerProps.openMenu}
          icon={<MoreHorizontal />}
        />
      );
    },
    []
  );

  const internalOnSelect = (key: BoardHeaderSettingsMenuKey | BoardCurrentView | BoardGroupBy) => {
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

  // TODO: auth checks
  const canCreateTask = true;
  const canUpdateBoard = true;
  const canDeleteBoard = true;
  const canCreateSprint = true;
  const canUpdateSprint = true;

  const boardHasSprintsSetup = !!board.sprintOptions;
  const menuItems: ItemType[] = [
    {
      key: BoardCurrentView.CURRENT_SPRINT,
      label: (
        <Space align="center" size={12}>
          <Checkbox
            checked={view === BoardCurrentView.CURRENT_SPRINT}
            disabled={!board.currentSprintId}
          />
          Current Sprint
        </Space>
      ),
      disabled: !board.currentSprintId,
    },
    {
      key: BoardCurrentView.ALL_TASKS,
      label: (
        <Space align="center" size={12}>
          <Checkbox checked={view === BoardCurrentView.ALL_TASKS} />
          All Tasks
        </Space>
      ),
    },
    {
      key: BoardCurrentView.SPRINTS,
      label: (
        <Space align="center" size={12}>
          <Checkbox checked={view === BoardCurrentView.SPRINTS} />
          Sprints
        </Space>
      ),
    },
  ];

  if (view === BoardCurrentView.CURRENT_SPRINT || view === BoardCurrentView.ALL_TASKS) {
    menuItems.push(
      {
        type: "divider",
        key: "group-by-divider",
      },
      {
        key: BoardGroupBy.STATUS,
        label: (
          <Space align="center" size={12}>
            <Checkbox checked={groupBy === BoardGroupBy.STATUS} />
            Status
          </Space>
        ),
      },
      {
        key: BoardGroupBy.LABELS,
        label: (
          <Space align="center" size={12}>
            <Checkbox checked={groupBy === BoardGroupBy.LABELS} />
            Labels
          </Space>
        ),
      },
      {
        key: BoardGroupBy.ASSIGNEES,
        label: (
          <Space align="center" size={12}>
            <Checkbox checked={groupBy === BoardGroupBy.ASSIGNEES} />
            Assignees
          </Space>
        ),
      }
    );
  }

  menuItems.push({
    type: "divider",
    key: "tasks-menu-divider",
  });

  if (canCreateTask) {
    menuItems.push({
      key: BoardHeaderSettingsMenuKey.ADD_TASK,
      label: (
        <Space align="center" size={12}>
          <Plus style={plusIconStyles} />
          Add Task
        </Space>
      ),
    });
  }

  menuItems.push({
    key: BoardHeaderSettingsMenuKey.SEARCH_TASKS,
    label: (
      <Space align="center" size={12}>
        <Search style={plusIconStyles} />
        Search Tasks
      </Space>
    ),
  });

  menuItems.push({
    type: "divider",
    key: "board-resources-divider",
  });

  if (boardHasSprintsSetup && canCreateSprint) {
    menuItems.push({
      key: BoardHeaderSettingsMenuKey.ADD_SPRINT,
      label: (
        <Space align="center" size={12}>
          <Plus style={plusIconStyles} />
          Sprint
        </Space>
      ),
    });
  }

  if (canUpdateBoard) {
    menuItems.push(
      {
        key: BoardHeaderSettingsMenuKey.EDIT_STATUS,
        label: (
          <Space align="center" size={12}>
            <Plus style={plusIconStyles} />
            Status
          </Space>
        ),
      },
      {
        key: BoardHeaderSettingsMenuKey.EDIT_RESOLUTIONS,
        label: (
          <Space align="center" size={12}>
            <Plus style={plusIconStyles} />
            Resolutions
          </Space>
        ),
      },
      {
        key: BoardHeaderSettingsMenuKey.EDIT_LABELS,
        label: (
          <Space align="center" size={12}>
            <Plus style={plusIconStyles} />
            Labels
          </Space>
        ),
      }
    );
  }

  if (canUpdateBoard) {
    menuItems.push({
      key: BoardHeaderSettingsMenuKey.EDIT,
      label: (
        <Space align="center" size={12}>
          <EditOutlined />
          <span>Edit board</span>
        </Space>
      ),
      style: { textTransform: "capitalize" },
    });
  }

  if (canDeleteBoard) {
    menuItems.push({
      key: BoardHeaderSettingsMenuKey.DELETE,
      label: (
        <Space align="center" size={12}>
          <Trash2
            style={{
              width: "14px",
              height: "14px",
              verticalAlign: "middle",
              marginTop: "-4px",
            }}
          />
          <span>Delete board</span>
        </Space>
      ),
      style: { textTransform: "capitalize" },
    });
  }

  if (board.currentSprintId && canUpdateSprint) {
    menuItems.push({
      key: BoardHeaderSettingsMenuKey.END_SPRINT,
      label: (
        <Space align="center" size={12}>
          <Clock style={plusIconStyles} />
          <span>End Sprint</span>
        </Space>
      ),
      style: { textTransform: "capitalize" },
    });
  }

  if (!boardHasSprintsSetup && canUpdateBoard) {
    menuItems.push({
      key: BoardHeaderSettingsMenuKey.SETUP_SPRINTS,
      label: (
        <Space align="center" size={12}>
          <Plus style={plusIconStyles} />
          Setup Sprints
        </Space>
      ),
      style: { textTransform: "capitalize" },
    });
  }

  const renderBlockOptions = (renderMenuProps: IMenuWithTriggerRenderMenuProps) => {
    return (
      <Menu
        onClick={(event) => {
          internalOnSelect(event.key as any);
          renderMenuProps.closeMenu();
        }}
        items={menuItems}
      />
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
