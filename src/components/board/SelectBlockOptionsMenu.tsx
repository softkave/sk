import {
  DeleteOutlined,
  EllipsisOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import StyledContainer from "../styled/Container";
import StyledMenuItem from "../styled/StyledMenuItem";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";

export type SettingsMenuKey = "view" | "delete";

export interface ISelectBlockOptionsMenuProps {
  block: IBlock;
  onSelect: (key: SettingsMenuKey) => void;
}

const SelectBlockOptionsMenu: React.FC<ISelectBlockOptionsMenuProps> = (
  props
) => {
  const { block, onSelect } = props;
  const blockTypeFullName = getBlockTypeFullName(block.type);

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
        <EllipsisOutlined style={{ fontSize: "27px" }} />
      </StyledContainer>
    );
  };

  const renderBlockOptions = (
    renderMenuProps: IMenuWithTriggerRenderMenuProps
  ) => {
    return (
      <Menu
        onClick={(event) => {
          onSelect(event.key as SettingsMenuKey);
          renderMenuProps.closeMenu();
        }}
      >
        <StyledMenuItem key="view">
          <PlayCircleOutlined />
          View or Edit {blockTypeFullName}
        </StyledMenuItem>
        <StyledMenuItem key="delete">
          <DeleteOutlined />
          Delete {blockTypeFullName}
        </StyledMenuItem>
      </Menu>
    );
  };

  return (
    <MenuWithTrigger
      menuType="dropdown"
      renderTrigger={renderTrigger}
      renderMenu={renderBlockOptions}
    />
  );
};

export default SelectBlockOptionsMenu;
