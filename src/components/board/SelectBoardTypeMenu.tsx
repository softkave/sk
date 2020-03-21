import Icon, { UnorderedListOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import KanbanSVG from "../icons/svg/KanbanSVG";
import TabSVG from "../icons/svg/TabSVG";
import StyledContainer from "../styled/Container";
import StyledMenuItem from "../styled/StyledMenuItem";
import wrapWithMargin from "../utilities/wrapWithMargin";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps
} from "./MenuWithTrigger";
import { BoardResourceType, BoardType } from "./types";
import { getBoardTypesForResourceType } from "./utils";

const boartTypesToIconMap = {
  kanban: <Icon component={KanbanSVG} style={{ backgroundColor: "inherit" }} />,
  list: <UnorderedListOutlined />,
  tab: (
    <Icon component={TabSVG} style={{ fontSize: "1.60em", marginTop: "5px" }} />
  )
};

export interface ISelectBoardTypeMenuProps {
  boardType: BoardType;
  isMobile: boolean;
  resourceType: BoardResourceType;
  block: IBlock;
  onSelect: (boardType: BoardType) => void;
}

const SelectBoardTypeMenu: React.FC<ISelectBoardTypeMenuProps> = props => {
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
          ["& .anticon"]: { fontSize: "16px" }
        }}
      >
        {boartTypesToIconMap[boardType]}
        {!isMobile && wrapWithMargin(boardType, 8, 0)}
      </StyledContainer>
    );
  };

  const renderBoardTypeOptions = (
    renderMenuProps: IMenuWithTriggerRenderMenuProps
  ) => {
    const availableBoardTypes =
      (resourceType &&
        getBoardTypesForResourceType(block, resourceType, isMobile)) ||
      [];

    return (
      <Menu
        selectedKeys={boardType ? [boardType] : []}
        onClick={event => {
          onSelect(event.key as BoardType);
          renderMenuProps.closeMenu();
        }}
      >
        {availableBoardTypes.map(type => {
          return (
            <StyledMenuItem key={type}>
              <StyledContainer s={{ alignItems: "center" }}>
                {boartTypesToIconMap[type]}
                {wrapWithMargin(type, 8, 0)}
              </StyledContainer>
            </StyledMenuItem>
          );
        })}
      </Menu>
    );
  };

  return (
    <MenuWithTrigger
      menuType="drawer"
      renderTrigger={renderBoardTypeSelection}
      renderMenu={renderBoardTypeOptions}
    />
  );
};

export default SelectBoardTypeMenu;
