import { MenuFoldOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import StyledMenuItem from "../styled/StyledMenuItem";
import wrapWithMargin from "../utilities/wrapWithMargin";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps
} from "./MenuWithTrigger";
import { BoardResourceType } from "./types";
import { getBlockResourceTypes, getBoardResourceTypeFullName } from "./utils";

export interface ISelectResourceTypeMenuProps {
  block: IBlock;
  onSelect: (resourceType: BoardResourceType) => void;

  resourceType?: BoardResourceType | null;
}

const SelectResourceTypeMenu: React.FC<ISelectResourceTypeMenuProps> = props => {
  const { resourceType, onSelect, block } = props;
  const childrenTypes = useBlockChildrenTypes(block);
  const resourceTypeName = getBoardResourceTypeFullName(resourceType);
  const blockResourceTypes = getBlockResourceTypes(block, childrenTypes);

  const renderResourceTypeSelection = (
    renderSelecProps: IMenuWithTriggerRenderTriggerProps
  ) => {
    return (
      <StyledContainer
        onClick={renderSelecProps.openMenu}
        s={{
          cursor: "pointer",
          alignItems: "center",
          ["& .anticon"]: { fontSize: "16px" }
        }}
      >
        <MenuFoldOutlined />
        {wrapWithMargin(resourceTypeName || "Select Resource Type", 8, 0)}
      </StyledContainer>
    );
  };

  const renderResourceTypeOptions = (
    renderMenuProps: IMenuWithTriggerRenderMenuProps
  ) => {
    return (
      <Menu
        selectedKeys={resourceType ? [resourceType] : []}
        onClick={event => {
          onSelect(event.key as BoardResourceType);
          renderMenuProps.closeMenu();
        }}
      >
        {blockResourceTypes.map(type => {
          return (
            <StyledMenuItem key={type}>
              {getBoardResourceTypeFullName(type)}
            </StyledMenuItem>
          );
        })}
      </Menu>
    );
  };

  return (
    <MenuWithTrigger
      menuType="drawer"
      renderTrigger={renderResourceTypeSelection}
      renderMenu={renderResourceTypeOptions}
    />
  );
};

export default SelectResourceTypeMenu;
