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
import StyledMenuItem from "../styled/StyledMenuItem";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";
import { CreateMenuKey } from "./types";

export interface ISelectBlockCreateNewOptionsMenuProps {
  block: IBlock;
  onSelect: (key: CreateMenuKey) => void;
}

const SelectBlockCreateNewOptionsMenu: React.FC<ISelectBlockCreateNewOptionsMenuProps> = (
  props
) => {
  const { onSelect, block } = props;
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
    const createMenuItems = childrenTypes.map((type) => (
      <StyledMenuItem key={type}>
        <BorderOutlined />
        Create {type}
      </StyledMenuItem>
    ));

    if (hasCollaborators) {
      createMenuItems.push(<Menu.Divider key="menu-divider-1" />);
      createMenuItems.push(
        <StyledMenuItem key="collaborator">
          <UserAddOutlined />
          Add Collaborator
        </StyledMenuItem>
      );
    }

    createMenuItems.push(
      <StyledMenuItem key="status">
        <ReconciliationOutlined />
        Add or Edit Status
      </StyledMenuItem>,
      <StyledMenuItem key="label">
        <TagOutlined />
        Add or Edit Labels
      </StyledMenuItem>
    );

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
