import { HomeOutlined } from "@ant-design/icons";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import BlockThumbnail from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import wrapWithMargin from "../utilities/wrapWithMargin";
import SelectBlockCreateNewOptionsMenu from "./SelectBlockCreateNewOptionsMenu";
import SelectBlockOptionsMenu, {
  SettingsMenuKey,
} from "./SelectBlockOptionsMenu";
import SelectBoardTypeMenu from "./SelectBoardTypeMenu";
import SelectResourceTypeMenu from "./SelectResourceTypeMenu";
import { BoardResourceType, BoardViewType, CreateMenuKey } from "./types";
import { getBoardViewTypesForResourceType } from "./utils";

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
  selectedBoardType: BoardViewType;
  isMobile: boolean;
  onClickCreateNewBlock: (type: BlockType) => void;
  onClickAddCollaborator: () => void;
  onClickAddOrEditLabel: () => void;
  onClickAddOrEditStatus: () => void;
  onClickEditBlock: () => void;
  onClickDeleteBlock: () => void;
  onNavigate: (
    resourceType: BoardResourceType | null,
    boardType: BoardViewType | null
  ) => void;

  resourceType?: BoardResourceType | null;
  style?: React.CSSProperties;
}

const BoardBlockHeader: React.FC<IBoardBlockHeaderProps> = (props) => {
  const {
    block,
    selectedBoardType,
    resourceType,
    onClickAddCollaborator,
    onClickCreateNewBlock,
    onClickDeleteBlock,
    onClickEditBlock,
    isMobile,
    onNavigate,
    onClickAddOrEditLabel,
    onClickAddOrEditStatus,
    style,
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

      case "label":
        onClickAddOrEditLabel();
        break;

      case "status":
        onClickAddOrEditStatus();
        break;
    }
  };

  const onSelectSettingsMenuItem = (key: SettingsMenuKey) => {
    switch (key) {
      case "view":
        onClickEditBlock();
        break;

      case "delete":
        onClickDeleteBlock();
        break;
    }
  };

  const onSelectResourceTypeMenuItem = (key: BoardResourceType) => {
    const boardTypesForResourceType = getBoardViewTypesForResourceType(
      block,
      key,
      isMobile
    );

    console.log({ key, boardTypesForResourceType, block });

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

  const onSelectBoardTypeMenuItem = (key: BoardViewType) => {
    onNavigate(resourceType!, key);
  };

  const renderSelfButton = () => {
    return (
      <StyledContainer
        onClick={() => onNavigate(null, null)}
        s={{
          alignItems: "center",
          cursor: "pointer",
          textTransform: "capitalize",
        }}
      >
        <HomeOutlined />
        {!isMobile && wrapWithMargin("home", 8, 0)}
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
        ...style,
        width: "100%",
        alignItems: "center",
      }}
    >
      <BlockThumbnail block={block} showFields={["name", "type"]} />
      <StyledContainer s={{ alignItems: "center" }}>
        {wrapWithMargin(renderCreateNewMenu(), 0, 8)}
        {/* {!isMobile && wrapWithMargin(renderResourceTypeMenu())} */}
        {isBlockRelatedResourceType(resourceType) &&
          wrapWithMargin(renderBoardTypeMenu())}
        {wrapWithMargin(renderBlockOptionsMenu(), 8, 0)}
      </StyledContainer>
    </StyledContainer>
  );
};

export default BoardBlockHeader;
