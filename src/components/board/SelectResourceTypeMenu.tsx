import {
  BorderOutlined,
  CaretDownOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import StyledMenuItem from "../styled/StyledMenuItem";
import wrapWithMargin from "../utilities/wrapWithMargin";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";
import { BoardResourceType } from "./types";
import { getBlockResourceTypes, getBoardResourceTypeFullName } from "./utils";

const getBlockResourceTypeIcon = (type: BoardResourceType) => {
  switch (type) {
    case "tasks":
      return <BorderOutlined />;

    case "projects":
      return <BorderOutlined />;

    case "groups":
      return <BorderOutlined />;

    case "collaborators":
      return <TeamOutlined />;

    case "collaboration-requests":
      return <SolutionOutlined />;
  }
};

export interface ISelectResourceTypeMenuProps {
  block: IBlock;
  onSelect: (resourceType: BoardResourceType) => void;

  resourceType?: BoardResourceType | null;
}

const SelectResourceTypeMenu: React.FC<ISelectResourceTypeMenuProps> = (
  props
) => {
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
          textTransform: "capitalize",
        }}
      >
        {resourceType && getBlockResourceTypeIcon(resourceType)}
        {wrapWithMargin(resourceTypeName || "Select Resource Type", 8, 0)}
        <CaretDownOutlined style={{ marginLeft: "8px" }} />
      </StyledContainer>
    );
  };

  const renderResourceTypeOptions = (
    renderMenuProps: IMenuWithTriggerRenderMenuProps
  ) => {
    return (
      <Menu
        selectedKeys={resourceType ? [resourceType] : []}
        onClick={(event) => {
          onSelect(event.key as BoardResourceType);
          renderMenuProps.closeMenu();
        }}
      >
        {blockResourceTypes.map((type) => {
          return (
            <StyledMenuItem key={type}>
              {getBlockResourceTypeIcon(type)}
              {getBoardResourceTypeFullName(type)}
            </StyledMenuItem>
          );
        })}
      </Menu>
    );
  };

  return (
    <MenuWithTrigger
      menuType="dropdown"
      renderTrigger={renderResourceTypeSelection}
      renderMenu={renderResourceTypeOptions}
    />
  );
};

export default SelectResourceTypeMenu;
