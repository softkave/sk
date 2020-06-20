import {
  BorderOutlined,
  PlusOutlined,
  ReconciliationOutlined,
  TagOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";
import { CreateMenuKey } from "./types";

export interface ISelectBlockCreateNewOptionsMenuProps {
  block: IBlock;
  onSelect: (key: CreateMenuKey) => void;

  noExtraMenuItems?: boolean;
}

const SelectBlockCreateNewOptionsMenu: React.FC<ISelectBlockCreateNewOptionsMenuProps> = (
  props
) => {
  const { onSelect, block, noExtraMenuItems } = props;
  const childrenTypes = useBlockChildrenTypes(block);
  const hasCollaborators = block.type === "org";

  const renderTrigger = (
    renderTriggerProps: IMenuWithTriggerRenderTriggerProps
  ) => {
    return (
      <StyledContainer
        s={{
          cursor: "pointer",
          textTransform: "capitalize",
        }}
        onClick={renderTriggerProps.openMenu}
      >
        <PlusOutlined style={{ fontSize: "16px" }} />
      </StyledContainer>
    );
  };

  const renderCreateNewOptions = (
    renderMenuProps: IMenuWithTriggerRenderMenuProps
  ) => {
    let addedDivider = false;
    const createMenuItems = childrenTypes.map((type) => (
      <Menu.Item style={{ textTransform: "capitalize" }} key={type}>
        <BorderOutlined />
        New {type}
      </Menu.Item>
    ));

    if (hasCollaborators) {
      addedDivider = true;
      createMenuItems.push(<Menu.Divider key="menu-divider-1" />);
      createMenuItems.push(
        <Menu.Item style={{ textTransform: "capitalize" }} key="collaborator">
          <UserAddOutlined />
          Add Collaborator
        </Menu.Item>
      );
    }

    if (!noExtraMenuItems) {
      if (!addedDivider) {
        createMenuItems.push(<Menu.Divider key="menu-divider-1" />);
      }

      createMenuItems.push(
        <Menu.Item style={{ textTransform: "capitalize" }} key="status">
          <ReconciliationOutlined />
          Add or Edit Status
        </Menu.Item>,
        <Menu.Item style={{ textTransform: "capitalize" }} key="label">
          <TagOutlined />
          Add or Edit Labels
        </Menu.Item>
      );
    }

    const createMenu = (
      <Menu
        onClick={(event) => {
          onSelect(event.key as CreateMenuKey);
          renderMenuProps.closeMenu();
        }}
      >
        {createMenuItems}
      </Menu>
    );

    return createMenu;
  };

  return (
    <MenuWithTrigger
      menuType="dropdown"
      renderTrigger={renderTrigger}
      renderMenu={renderCreateNewOptions}
    />
  );
};

export default SelectBlockCreateNewOptionsMenu;
