import { Dropdown, Menu } from "antd";
import React from "react";

import Priority, { TaskPriority } from "./Priority";

export interface IEditPriorityProps {
  value: TaskPriority;
  onChange: (value: string) => void;
}

export default class EditPriority extends React.Component<IEditPriorityProps> {
  public render() {
    const { value, onChange } = this.props;

    const menu = (
      <Menu onClick={({ key }) => onChange(key)}>
        <Menu.Item key="very important">
          <Priority level="very important" />
        </Menu.Item>
        <Menu.Item key="not important">
          <Priority level="not important" />
        </Menu.Item>
        <Menu.Item key="important">
          <Priority level="important" />
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <div style={{ cursor: "pointer" }}>
          <Priority level={value} />
        </div>
      </Dropdown>
    );
  }
}
