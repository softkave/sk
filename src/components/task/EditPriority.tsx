import { Dropdown, Menu } from "antd";
import React from "react";
import { BlockPriority } from "../../models/block/block";
import Priority, { TaskPriority } from "./Priority";

export interface IEditPriorityProps {
  value: TaskPriority;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default class EditPriority extends React.Component<IEditPriorityProps> {
  public render() {
    const { value, onChange, disabled } = this.props;
    const menu = (
      <Menu
        onClick={({ key }) => onChange(key as string)}
        selectedKeys={[value]}
      >
        <Menu.Item key={BlockPriority.High}>
          <Priority level={BlockPriority.High} />
        </Menu.Item>
        {/* <Menu.Divider /> */}
        <Menu.Item key={BlockPriority.Medium}>
          <Priority level={BlockPriority.Medium} />
        </Menu.Item>
        {/* <Menu.Divider /> */}
        <Menu.Item key={BlockPriority.Low}>
          <Priority level={BlockPriority.Low} />
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
      <Dropdown overlay={menu} trigger={["click"]}>
        {renderDropdownContent()}
      </Dropdown>
    );
  }
}
