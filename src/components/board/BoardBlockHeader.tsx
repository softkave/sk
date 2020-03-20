import Icon, {
  HomeOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  SettingOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Drawer } from "antd";
import { Menu } from "antd";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import KanbanSVG from "../icons/svg/KanbanSVG";
import TabSVG from "../icons/svg/TabSVG";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import { BoardResourceType, BoardType } from "./types";
import {
  getBlockResourceTypes,
  getBoardResourceTypeFullName,
  getBoardTypesForResourceType
} from "./utils";

type CreateMenuKey = BlockType | "collaborator";
type SettingsMenuKey = "edit" | "delete";
type Menus = "create-new" | "block-options" | "resource-type" | "board-type";

const StyledContainerAsH1 = StyledContainer.withComponent("h1");
// const selectedElemColor = "rgb(66,133,244)";

const boartTypesToIconMap = {
  kanban: <Icon component={KanbanSVG} style={{ backgroundColor: "inherit" }} />,
  list: <UnorderedListOutlined />,
  tab: (
    <Icon component={TabSVG} style={{ fontSize: "1.60em", marginTop: "5px" }} />
  )
};

const isBlockRelatedResourceType = (type?: BoardResourceType | null) => {
  switch (type) {
    case "groups":
    case "projects":
    case "tasks":
      return true;

    case "collaborators":
    case "collaboration-requests":
    default:
      return false;
  }
};

export interface IBoardBlockHeaderProps {
  block: IBlock;
  selectedBoardType: BoardType;
  isMobile: boolean;
  onClickCreateNewBlock: (type: BlockType) => void;
  onClickAddCollaborator: () => void;
  onClickEditBlock: () => void;
  onClickDeleteBlock: () => void;
  onNavigate: (
    resourceType: BoardResourceType | null,
    boardType: BoardType | null
  ) => void;
  resourceType?: BoardResourceType | null;
}

const BoardBlockHeader: React.FC<IBoardBlockHeaderProps> = props => {
  const {
    block,
    selectedBoardType,
    resourceType,
    onClickAddCollaborator,
    onClickCreateNewBlock,
    onClickDeleteBlock,
    onClickEditBlock,
    isMobile,
    onNavigate
  } = props;

  const [drawerFor, setDrawerFor] = React.useState<Menus | null>(null);

  const blockTypeFullName = getBlockTypeFullName(block.type);
  const hasCollaborators = block.type === "org";
  const childrenTypes = useBlockChildrenTypes(block);
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

    setDrawerFor(null);
  };

  const onSelectSettingsMenuItem = (key: SettingsMenuKey) => {
    switch (key) {
      case "edit":
        onClickEditBlock();
        break;

      case "delete":
        onClickDeleteBlock();
        break;
    }

    setDrawerFor(null);
  };

  const onSelectResourceTypeMenuItem = (key: BoardResourceType) => {
    const boardTypesForResourceType = getBoardTypesForResourceType(
      block,
      key,
      isMobile
    );

    switch (key) {
      case "groups":
      case "projects":
      case "tasks":
        onNavigate(
          key,
          selectedBoardType &&
            boardTypesForResourceType.includes(selectedBoardType)
            ? selectedBoardType
            : boardTypesForResourceType[0]
        );
        break;

      case "collaboration-requests":
      case "collaborators":
        onNavigate(key, null);
        break;
    }

    setDrawerFor(null);
  };

  const onSelectBoardTypeMenuItem = (key: BoardType) => {
    onNavigate(resourceType!, key);
    setDrawerFor(null);
  };

  const renderOptionsDrawer = (
    title: string,
    onClose: () => void,
    render: () => React.ReactNode
  ) => {
    return (
      <Drawer
        visible
        closable
        title={title}
        placement="right"
        onClose={onClose}
        width={300}
      >
        <StyledContainer
          s={{
            flexDirection: "column",
            width: "100%",
            flex: 1,
            alignItems: "center"
          }}
        >
          {render()}
        </StyledContainer>
      </Drawer>
    );
  };

  const wrapWithMargin = (
    content: React.ReactNode,
    marginLeft = 8,
    marginRight = 8
  ) => {
    return (
      <StyledContainer s={{ marginLeft, marginRight }}>
        {content}
      </StyledContainer>
    );
  };

  const wrapMenu = (menu: React.ReactNode) => {
    return (
      <StyledContainer s={{ ["& ul"]: { borderRight: 0 } }}>
        {menu}
      </StyledContainer>
    );
  };

  const renderResourceTypeSelection = () => {
    return (
      <StyledContainer
        onClick={() => setDrawerFor("resource-type")}
        s={{ alignItems: "center", cursor: "pointer" }}
      >
        <MenuFoldOutlined />
        {wrapWithMargin(resourceTypeName, 8, 0)}
      </StyledContainer>
    );
  };

  const renderBoardTypeSelection = () => {
    return (
      <StyledContainer
        onClick={() => setDrawerFor("board-type")}
        s={{ alignItems: "center", cursor: "pointer" }}
      >
        {boartTypesToIconMap[selectedBoardType]}
        {!isMobile && wrapWithMargin(selectedBoardType, 8, 0)}
      </StyledContainer>
    );
  };

  const renderSelfButton = () => {
    return (
      <StyledContainer
        onClick={() => onNavigate(null, null)}
        s={{ alignItems: "center", cursor: "pointer" }}
      >
        <HomeOutlined />
        {!isMobile && wrapWithMargin("Home", 8, 0)}
      </StyledContainer>
    );
  };

  const renderResourceTypeOptions = () => {
    return wrapMenu(
      <Menu
        selectedKeys={resourceType ? [resourceType] : []}
        onClick={event =>
          onSelectResourceTypeMenuItem(event.key as BoardResourceType)
        }
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

  const renderBoardTypeOptions = () => {
    const availableBoardTypes =
      (resourceType &&
        getBoardTypesForResourceType(block, resourceType, isMobile)) ||
      [];

    return wrapMenu(
      <Menu
        selectedKeys={selectedBoardType ? [selectedBoardType] : []}
        onClick={event => onSelectBoardTypeMenuItem(event.key as BoardType)}
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

  const renderCreateNewOptions = () => {
    const createMenuItems = childrenTypes.map(type => (
      <StyledMenuItem key={type}>Create {type}</StyledMenuItem>
    ));

    if (hasCollaborators) {
      createMenuItems.push(<Menu.Divider key="menu-divider-1" />);
      createMenuItems.push(
        <StyledMenuItem key="collaborator">Add Collaborator</StyledMenuItem>
      );
    }

    const createMenu = wrapMenu(
      <Menu
        onClick={event => onSelectCreateMenuItem(event.key as CreateMenuKey)}
      >
        {createMenuItems}
      </Menu>
    );

    return createMenu;
  };

  const renderBlockOptions = () => {
    return wrapMenu(
      <Menu
        onClick={event =>
          onSelectSettingsMenuItem(event.key as SettingsMenuKey)
        }
      >
        <StyledMenuItem key="edit">Edit {blockTypeFullName}</StyledMenuItem>
        <StyledMenuItem key="delete">Delete {blockTypeFullName}</StyledMenuItem>
      </Menu>
    );
  };

  const renderMenus = () => {
    if (drawerFor) {
      let title: string = "Options";
      let renderFn: () => React.ReactNode = () => null;
      const onCloseDrawer = () => setDrawerFor(null);

      switch (drawerFor) {
        case "block-options":
          title = "Block Options";
          renderFn = renderBlockOptions;
          break;

        case "board-type":
          title = "Select Board Type";
          renderFn = renderBoardTypeOptions;
          break;

        case "create-new":
          title = "Select Resource Type";
          renderFn = renderCreateNewOptions;
          break;

        case "resource-type":
          title = "Select Resource Type";
          renderFn = renderResourceTypeOptions;
          break;
      }

      return renderOptionsDrawer(title, onCloseDrawer, renderFn);
    }

    return null;
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
            margin: 0,
            lineHeight: "18px"
          }}
        >
          {block.name}
        </StyledContainerAsH1>
        <StyledContainer>
          {block.type}
          {resourceType && (
            <StyledContainer
              s={{
                borderLeft: "1px solid rgba(0, 0, 0, 0.65)",
                paddingLeft: "8px",
                marginLeft: "8px",
                textDecoration: "underline"
              }}
            >
              {renderResourceTypeSelection()}
            </StyledContainer>
          )}
        </StyledContainer>
      </StyledContainer>
      <StyledContainer s={{ alignItems: "center" }}>
        <StyledContainer
          style={{ margin: "0 8px", cursor: "pointer" }}
          onClick={() => setDrawerFor("create-new")}
        >
          <PlusOutlined />
        </StyledContainer>
        {wrapWithMargin(renderSelfButton())}
        {!isMobile && wrapWithMargin(renderResourceTypeSelection())}
        {isBlockRelatedResourceType(resourceType) &&
          wrapWithMargin(renderBoardTypeSelection())}
        <StyledContainer
          style={{ marginLeft: "8px", cursor: "pointer" }}
          onClick={() => setDrawerFor("block-options")}
        >
          <SettingOutlined />
        </StyledContainer>
      </StyledContainer>
      {renderMenus()}
    </StyledContainer>
  );
};

export default BoardBlockHeader;

const StyledMenuItem = styled(Menu.Item)({
  textTransform: "capitalize",
  display: "flex"
});
