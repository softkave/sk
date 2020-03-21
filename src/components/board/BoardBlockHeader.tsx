import { HomeOutlined } from "@ant-design/icons";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import wrapWithMargin from "../utilities/wrapWithMargin";
import SelectBlockCreateNewOptionsMenu from "./SelectBlockCreateNewOptionsMenu";
import SelectBlockOptionsMenu from "./SelectBlockOptionsMenu";
import SelectBoardTypeMenu from "./SelectBoardTypeMenu";
import SelectResourceTypeMenu from "./SelectResourceTypeMenu";
import { BoardResourceType, BoardType } from "./types";
import { getBoardTypesForResourceType } from "./utils";

type CreateMenuKey = BlockType | "collaborator";
type SettingsMenuKey = "edit" | "delete";

const StyledContainerAsH1 = StyledContainer.withComponent("h1");

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
  };

  const onSelectBoardTypeMenuItem = (key: BoardType) => {
    onNavigate(resourceType!, key);
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

  const renderResourceTypeMenu = () => (
    <SelectResourceTypeMenu
      block={block}
      resourceType={resourceType}
      onSelect={onSelectResourceTypeMenuItem}
    />
  );

  const renderBoardTypeMenu = () => {
    if (resourceType) {
      return (
        <SelectBoardTypeMenu
          block={block}
          boardType={selectedBoardType}
          isMobile={isMobile}
          resourceType={resourceType}
          onSelect={onSelectBoardTypeMenuItem}
        />
      );
    }

    return null;
  };

  const renderCreateNewMenu = () => (
    <SelectBlockCreateNewOptionsMenu
      block={block}
      onSelect={onSelectCreateMenuItem}
    />
  );

  const renderBlockOptionsMenu = () => (
    <SelectBlockOptionsMenu block={block} onSelect={onSelectSettingsMenuItem} />
  );

  return (
    <StyledContainer
      s={{
        width: "100%",
        alignItems: "center",
        ["& .anticon"]: { fontSize: "16px" }
      }}
    >
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
              {renderResourceTypeMenu()}
            </StyledContainer>
          )}
        </StyledContainer>
      </StyledContainer>
      <StyledContainer s={{ alignItems: "center" }}>
        {wrapWithMargin(renderCreateNewMenu(), 0, 8)}
        {wrapWithMargin(renderSelfButton())}
        {!isMobile && wrapWithMargin(renderResourceTypeMenu())}
        {isBlockRelatedResourceType(resourceType) &&
          wrapWithMargin(renderBoardTypeMenu())}
        {wrapWithMargin(renderBlockOptionsMenu(), 8, 0)}
      </StyledContainer>
    </StyledContainer>
  );
};

export default BoardBlockHeader;
