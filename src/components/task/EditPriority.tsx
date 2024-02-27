import { css } from "@emotion/css";
import { Dropdown, Menu } from "antd";
import React from "react";
import { TaskPriority } from "../../models/task/types";
import Priority from "./Priority";

export interface IEditPriorityProps {
  value: TaskPriority;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default class EditPriority extends React.Component<IEditPriorityProps> {
  render() {
    const { value, onChange, disabled } = this.props;
    const menu = (
      <Menu onClick={({ key }) => onChange(key as string)} selectedKeys={[value]}>
        <Menu.Item key={TaskPriority.High}>
          <Priority level={TaskPriority.High} />
        </Menu.Item>
        <Menu.Item key={TaskPriority.Medium}>
          <Priority level={TaskPriority.Medium} />
        </Menu.Item>
        <Menu.Item key={TaskPriority.Low}>
          <Priority level={TaskPriority.Low} />
        </Menu.Item>
      </Menu>
    );

    const renderDropdownContent = () => {
      return (
        <div
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <Priority withSelectIcon level={value} />
        </div>
      );
    };

    if (disabled) {
      return renderDropdownContent();
    }

    return (
      <Dropdown overlay={menu} trigger={["click"]} className={css({ width: "100%" })}>
        {renderDropdownContent()}
      </Dropdown>
    );
  }
}
