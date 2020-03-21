import { EllipsisOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import StyledContainer from "../styled/Container";
import StyledMenuItem from "../styled/StyledMenuItem";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps
} from "./MenuWithTrigger";

export type SettingsMenuKey = "edit" | "delete";

export interface ISelectBlockOptionsMenuProps {
  block: IBlock;
  onSelect: (key: SettingsMenuKey) => void;
}

const SelectBlockOptionsMenu: React.FC<ISelectBlockOptionsMenuProps> = props => {
  const { block, onSelect } = props;
  const blockTypeFullName = getBlockTypeFullName(block.type);

  const renderTrigger = (
    renderTriggerProps: IMenuWithTriggerRenderTriggerProps
  ) => {
    return (
      <StyledContainer
        s={{ cursor: "pointer", ["& .anticon"]: { fontSize: "16px" } }}
        onClick={renderTriggerProps.openMenu}
      >
        <EllipsisOutlined style={{ fontSize: "24px" }} />
      </StyledContainer>
    );
  };

  const renderBlockOptions = (
    renderMenuProps: IMenuWithTriggerRenderMenuProps
  ) => {
    return (
      <Menu
        onClick={event => {
          onSelect(event.key as SettingsMenuKey);
          renderMenuProps.closeMenu();
        }}
      >
        <StyledMenuItem key="edit">Edit {blockTypeFullName}</StyledMenuItem>
        <StyledMenuItem key="delete">Delete {blockTypeFullName}</StyledMenuItem>
      </Menu>
    );
  };

  return (
    <MenuWithTrigger
      menuType="drawer"
      renderTrigger={renderTrigger}
      renderMenu={renderBlockOptions}
    />
  );
};

export default SelectBlockOptionsMenu;
