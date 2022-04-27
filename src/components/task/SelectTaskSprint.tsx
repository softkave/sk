import { CaretDownOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space, Tag } from "antd";
import React from "react";
import { ISprint } from "../../models/sprint/types";
import { getCurrentAndUpcomingSprints } from "../../models/sprint/utils";
import { ITask } from "../../models/task/types";

export interface ISelectTaskSprintProps {
  task: ITask;
  sprints: ISprint[];
  sprintsMap: { [key: string]: ISprint };
  onChangeSprint: (sprintId: string) => void;
  onAddNewSprint: () => void;
  disabled?: boolean;
}

const SelectTaskSprint: React.FC<ISelectTaskSprintProps> = (props) => {
  const {
    task,
    sprints,
    sprintsMap,
    disabled,
    onChangeSprint,
    onAddNewSprint,
  } = props;

  const value = task.taskSprint?.sprintId || BACKLOG;
  const currentAndUpcomingSprints = getCurrentAndUpcomingSprints(sprints);

  const parentsMenu = (
    <Menu
      onClick={(evt) => {
        if (evt.key === ADD_NEW_SPRINT_KEY) {
          onAddNewSprint();
          return;
        }

        if (evt.key === value) {
          return;
        }

        onChangeSprint(evt.key as string);
      }}
      style={{ maxHeight: "300px", overflowY: "auto" }} // TODO: custom scroll, and for others like it
      selectedKeys={value ? [value] : undefined}
    >
      <Menu.Item key={ADD_NEW_SPRINT_KEY}>
        <PlusOutlined /> {SPRINT}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key={BACKLOG}>{BACKLOG}</Menu.Item>
      {currentAndUpcomingSprints.map((sprint) => (
        <Menu.Item key={sprint.customId}>{sprint.name}</Menu.Item>
      ))}
    </Menu>
  );

  const renderDropdownContent = () => {
    const sprint = sprintsMap[value];
    let nameContent = "";

    if (sprint) {
      nameContent = sprint.name;
    } else {
      nameContent = BACKLOG;
    }

    return (
      <div
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          width: "100%",
        }}
      >
        <Tag>
          <Space>
            {nameContent}
            <CaretDownOutlined style={{ fontSize: "10px", color: "#999" }} />
          </Space>
        </Tag>
      </div>
    );
  };

  if (disabled) {
    return renderDropdownContent();
  }

  return (
    <Dropdown overlay={parentsMenu} trigger={["click"]}>
      {renderDropdownContent()}
    </Dropdown>
  );
};

export default SelectTaskSprint;

export const BACKLOG = "Backlog";
const ADD_NEW_SPRINT_KEY = "add-new-sprint";
const SPRINT = "Sprint";
