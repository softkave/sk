import React from "react";
import { Menu, Dropdown, Icon, Button } from "antd";

const MenuItem = Menu.Item;

export default function AddDropdownButton(props) {
  const { types, onClick, label, className } = props;
  const menu = (
    <Menu onClick={event => onClick(event.key)}>
      {types.map(type => {
        type = typeof type === "string" ? { label: type } : type;
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
}
