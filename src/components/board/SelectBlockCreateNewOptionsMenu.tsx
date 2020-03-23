import { PlusOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import StyledMenuItem from "../styled/StyledMenuItem";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps
} from "./MenuWithTrigger";

export type CreateMenuKey = BlockType | "collaborator";

export interface ISelectBlockCreateNewOptionsMenuProps {
  block: IBlock;
  onSelect: (key: CreateMenuKey) => void;
}

const SelectBlockCreateNewOptionsMenu: React.FC<ISelectBlockCreateNewOptionsMenuProps> = props => {
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
          ["& .anticon"]: { fontSize: "16px" }
        }}
        onClick={renderTriggerProps.openMenu}
      >
        <PlusOutlined />
      </StyledContainer>
    );
  };

  const renderCreateNewOptions = (
    renderMenuProps: IMenuWithTriggerRenderMenuProps
  ) => {
    const createMenuItems = childrenTypes.map(type => (
      <StyledMenuItem key={type}>Create {type}</StyledMenuItem>
    ));

    if (hasCollaborators) {
      createMenuItems.push(<Menu.Divider key="menu-divider-1" />);
      createMenuItems.push(
        <StyledMenuItem key="collaborator">Add Collaborator</StyledMenuItem>
      );
    }

    const createMenu = (
      <Menu
        onClick={event => {
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
      menuType="drawer"
      renderTrigger={renderTrigger}
      renderMenu={renderCreateNewOptions}
    />
  );
};

export default SelectBlockCreateNewOptionsMenu;
