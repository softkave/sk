import CaretDownOutlined from "@ant-design/icons/CaretDownOutlined";
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
      <Menu onClick={({ key }) => onChange(key)}>
        <Menu.Item key="very important">
          <Priority level={BlockPriority.VeryImportant} />
        </Menu.Item>
        <Menu.Item key="not important">
          <Priority level={BlockPriority.NotImportant} />
        </Menu.Item>
        <Menu.Item key="important">
          <Priority level={BlockPriority.Important} />
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
          <Priority level={value} />
          <CaretDownOutlined style={{ marginLeft: "2px" }} />
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
