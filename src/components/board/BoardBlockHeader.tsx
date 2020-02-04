import styled from "@emotion/styled";
import { Dropdown, Icon, Menu, Select } from "antd";
import isFunction from "lodash/isFunction";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import KanbanSVG from "../icons/svg/KanbanSVG";
import TabSVG from "../icons/svg/TabSVG";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import StyledDrawerMenu from "../styled/StyledDrawerMenu";
import { BoardResourceType, BoardType } from "./types";
import { getBlockResourceTypes, getBoardResourceTypeFullName } from "./utils";

type CreateMenuKey = BlockType | "collaborator";
type SettingsMenuKey = "edit" | "delete";

const StyledContainerAsH1 = StyledContainer.withComponent("h1");
const selectedBoardTypeColor = "rgb(66,133,244)";

export interface IBoardBlockHeaderProps {
  block: IBlock;
  availableBoardTypes: BoardType[];
  selectedBoardType: BoardType;
  onChangeBoardType: (boardType: BoardType) => void;
  onClickCreateNewBlock: (type: BlockType) => void;
  onClickAddCollaborator: () => void;
  onClickEditBlock: () => void;
  onClickDeleteBlock: () => void;
  resourceType?: BoardResourceType | null;
  onChangeKanbanResourceType?: (blockType: BoardResourceType) => void;
}

const BoardBlockHeader: React.FC<IBoardBlockHeaderProps> = props => {
  const {
    block,
    availableBoardTypes,
    selectedBoardType,
    resourceType,
    onChangeBoardType,
    onChangeKanbanResourceType,
    onClickAddCollaborator,
    onClickCreateNewBlock,
    onClickDeleteBlock,
    onClickEditBlock
  } = props;
  const blockTypeFullName = getBlockTypeFullName(block.type);
  const hasCollaborators = block.type === "org";
  const childrenTypes = useBlockChildrenTypes(block);
  const showKanban = availableBoardTypes.includes("kanban");
  const showList = availableBoardTypes.includes("list");
  const showTabs = availableBoardTypes.includes("tab");
  const resourceTypeName = getBoardResourceTypeFullName(resourceType);
  const blockResourceTypes = getBlockResourceTypes(block, childrenTypes);

  const onSelectCreateMenuItem = (key: CreateMenuKey) => {
    switch (key) {
      case "group":
      case "project":
      case "task":
      case "org":
        onClickCreateNewBlock(key as BlockType);
        break;

      case "collaborator":
        onClickAddCollaborator();
        break;
    }
  };

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
    <StyledDrawerMenu
      onClick={event => onSelectCreateMenuItem(event.key as CreateMenuKey)}
    >
      {createMenuItems}
    </StyledDrawerMenu>
  );

  const onSelectSettingsMenuItem = (key: SettingsMenuKey) => {
    switch (key) {
      case "edit":
        onClickEditBlock();
        break;

      case "delete":
        onClickDeleteBlock();
        break;
    }
  };

  const settingsMenu = (
    <StyledDrawerMenu
      onClick={event => onSelectSettingsMenuItem(event.key as SettingsMenuKey)}
    >
      <StyledMenuItem key="edit">Edit {blockTypeFullName}</StyledMenuItem>
      <StyledMenuItem key="delete">Delete {blockTypeFullName}</StyledMenuItem>
    </StyledDrawerMenu>
  );

  const renderKanbanSelector = () => {
    return (
      <StyledContainer s={{ margin: "0 8px" }}>
        <StyledFlatButton
          onClick={() => onChangeBoardType("kanban")}
          style={{
            color:
              selectedBoardType === "kanban"
                ? selectedBoardTypeColor
                : undefined
          }}
        >
          <Icon component={KanbanSVG} />
        </StyledFlatButton>
        {selectedBoardType === "kanban" &&
          isFunction(onChangeKanbanResourceType) && (
            <Select
              value={resourceType}
              onChange={value => onChangeKanbanResourceType(value)}
              style={{ marginLeft: "8px" }}
            >
              {blockResourceTypes.map(type => (
                <Select.Option value={type}>
                  {getBoardResourceTypeFullName(type)}
                </Select.Option>
              ))}
            </Select>
          )}
      </StyledContainer>
    );
  };

  return (
    <StyledContainer s={{ width: "100%", alignItems: "center" }}>
      <StyledContainer>
        <ItemAvatar color={block.color} />
      </StyledContainer>
      <StyledContainer
        s={{
          flex: 1,
          flexDirection: "column",
          margin: "0 16px",
          justifyContent: "center"
        }}
      >
        <StyledContainerAsH1
          s={{
            fontSize: "18px",
            textOverflow: "ellipsis",
            flex: 1,
            margin: 0
          }}
        >
          {block.name}
        </StyledContainerAsH1>
        {resourceType && (
          <StyledContainer s={{ marginTop: "8px" }}>
            {resourceTypeName}
          </StyledContainer>
        )}
      </StyledContainer>
      <Dropdown
        placement="bottomRight"
        overlay={createMenu}
        trigger={["click"]}
      >
        <StyledFlatButton style={{ margin: "0 8px" }}>
          <Icon type="plus" />
        </StyledFlatButton>
      </Dropdown>
      {showKanban && renderKanbanSelector()}
      {showList && (
        <StyledFlatButton
          onClick={() => onChangeBoardType("list")}
          style={{
            margin: "0 8px",
            color:
              selectedBoardType === "list" ? selectedBoardTypeColor : undefined
          }}
        >
          <Icon type="unordered-list" />
        </StyledFlatButton>
      )}
      {showTabs && (
        <StyledFlatButton
          onClick={() => onChangeBoardType("tab")}
          style={{
            margin: "0 8px",
            color:
              selectedBoardType === "tab" ? selectedBoardTypeColor : undefined
          }}
        >
          <Icon
            component={TabSVG}
            style={{ fontSize: "1.60em", marginTop: "5px" }}
          />
        </StyledFlatButton>
      )}
      <Dropdown overlay={settingsMenu} trigger={["click"]}>
        <StyledFlatButton style={{ marginLeft: "8px" }}>
          <Icon type="setting" />
        </StyledFlatButton>
      </Dropdown>
    </StyledContainer>
  );
};

export default BoardBlockHeader;

const StyledMenuItem = styled(Menu.Item)({
  textTransform: "capitalize",
  display: "flex"
});
