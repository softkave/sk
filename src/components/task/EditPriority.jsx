import React from "react";
import { Dropdown, Menu } from "antd";
import Priority, { priorityToColorMap } from "./Priority.jsx";

export default function EditPriority(props) {
  const { value, onChange } = props;
  const menu = (
    <Menu onClick={({ key }) => onChange(key)}>
      <Menu.Item key="not important">
        <Priority level="not important" cover />
      </Menu.Item>
      <Menu.Item key="important">
        <Priority level="important" cover />
      </Menu.Item>
      <Menu.Item key="very important">
        <Priority level="very important" cover />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <span
        className="sk-priority"
        style={{
          backgroundColor: priorityToColorMap[value],
          cursor: "pointer"
        }}
      >
        {value}
      </span>

      {/*<Priority key="va" level={value} />*/}
    </Dropdown>
  );
}
