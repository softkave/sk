import { Button, Dropdown, Icon, Menu } from "antd";
import React from "react";

const MenuItem = Menu.Item;

type Label =
  | Array<{
      icon?: string;
      label: string;
    }>
  | string[];

export interface IAddDropdownButtonProps {
  types: Label;
  label: React.ReactNode;
  onClick: (label: string) => void;
  className?: string;
}

const AddDropdownButton: React.SFC<IAddDropdownButtonProps> = props => {
  const { types, onClick, label, className } = props;
  const mappedTypes = (types as any).map((type: Label) => {
    return typeof type === "string" ? { label: type } : type;
  });

  const menu = (
    <Menu onClick={event => onClick(event.key)}>
      {mappedTypes.map(type => {
        return (
          <MenuItem key={type.label}>
            {type.icon && <Icon type={type.icon} />}
            {type.label}
          </MenuItem>
        );
      })}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button className={className} icon="plus">
        {label}
      </Button>
    </Dropdown>
  );
};

export default AddDropdownButton;
