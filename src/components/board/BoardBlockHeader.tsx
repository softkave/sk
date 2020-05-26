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
import { BoardResourceType, BoardViewType, CreateMenuKey } from "./types";

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

  noExtraCreateMenuItems?: boolean;
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
    noExtraCreateMenuItems,
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

  const onSelectBoardTypeMenuItem = (key: BoardViewType) => {
    onNavigate(resourceType!, key);
  };

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
      noExtraMenuItems={noExtraCreateMenuItems}
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
        {isBlockRelatedResourceType(resourceType) &&
          wrapWithMargin(renderBoardTypeMenu())}
        {wrapWithMargin(renderBlockOptionsMenu(), 8, 0)}
      </StyledContainer>
    </StyledContainer>
  );
};

export default BoardBlockHeader;
