import {
  CaretDownOutlined,
  InsertRowAboveOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { Columns } from "react-feather";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import StyledMenuItem from "../styled/StyledMenuItem";
import wrapWithMargin from "../utilities/wrapWithMargin";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";
import { BoardResourceType, BoardViewType } from "./types";
import {
  getBoardViewTypeFullName,
  getBoardViewTypesForResourceType,
} from "./utils";

const boartTypesToIconMap = {
  "group-kanban": <Columns style={{ width: "16px" }} />,
  "status-kanban": <Columns style={{ width: "16px" }} />,
  list: <MenuOutlined />,
  tab: <InsertRowAboveOutlined />,
};

export interface ISelectBoardTypeMenuProps {
  boardType: BoardViewType;
  isMobile: boolean;
  resourceType: BoardResourceType;
  block: IBlock;
  onSelect: (boardType: BoardViewType) => void;
}

const SelectBoardTypeMenu: React.FC<ISelectBoardTypeMenuProps> = (props) => {
  const { boardType, onSelect, isMobile, resourceType, block } = props;

  const renderBoardTypeSelection = (
    renderTriggerProps: IMenuWithTriggerRenderTriggerProps
  ) => {
    return (
      <StyledContainer
        onClick={renderTriggerProps.openMenu}
        s={{
          cursor: "pointer",
          alignItems: "center",
          textTransform: "capitalize",
        }}
      >
        {boartTypesToIconMap[boardType]}
        {!isMobile && wrapWithMargin(getBoardViewTypeFullName(boardType), 8, 0)}
        <CaretDownOutlined style={{ marginLeft: "8px" }} />
      </StyledContainer>
    );
  };

  const renderBoardTypeOptions = (
    renderMenuProps: IMenuWithTriggerRenderMenuProps
  ) => {
    const availableBoardTypes =
      (resourceType &&
        getBoardViewTypesForResourceType(block, resourceType, isMobile)) ||
      [];

    return (
      <Menu
        selectedKeys={boardType ? [boardType] : []}
        onClick={(event) => {
          onSelect(event.key as BoardViewType);
          renderMenuProps.closeMenu();
        }}
      >
        {availableBoardTypes.map((type) => {
          return (
            <StyledMenuItem key={type}>
              <StyledContainer s={{ alignItems: "center" }}>
                {boartTypesToIconMap[type]}
                {wrapWithMargin(getBoardViewTypeFullName(type), 8, 0)}
              </StyledContainer>
            </StyledMenuItem>
          );
        })}
      </Menu>
    );
  };

  return (
    <MenuWithTrigger
      menuType="dropdown"
      renderTrigger={renderBoardTypeSelection}
      renderMenu={renderBoardTypeOptions}
    />
  );
};

export default SelectBoardTypeMenu;
