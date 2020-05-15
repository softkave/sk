import path from "path";
import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import BoardBlockHeader from "./BoardBlockHeader";
import BoardTypeKanban from "./BoardTypeKanban";
import BoardTypeList from "./BoardTypeList";
import BoardLandingPage from "./LandingPage";
import {
  BoardResourceType,
  BoardViewType,
  IBoardResourceTypePathMatch,
} from "./types";
import {
  getBlockResourceTypes,
  getBoardViewTypesForResourceType,
  getDefaultBoardViewType,
} from "./utils";
import ViewByStatusContainer from "./ViewByStatusContainer";

export interface IBoardHomeForBlockProps {
  blockPath: string;
  block: IBlock;
  isMobile: boolean;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickAddBlock: (block: IBlock, type: BlockType) => void;
  onNavigate: (resourceType: BoardResourceType) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  onClickAddCollaborator: () => void;
  onClickAddOrEditLabel: () => void;
  onClickAddOrEditStatus: () => void;
  onClickDeleteBlock: (block: IBlock) => void;
}

const BoardMain: React.FC<IBoardHomeForBlockProps> = (props) => {
  const {
    blockPath,
    block,
    onNavigate,
    onClickAddBlock,
    onClickAddCollaborator,
    onClickDeleteBlock,
    onClickUpdateBlock,
    onClickBlock,
    isMobile,
    onClickAddOrEditLabel,
    onClickAddOrEditStatus,
  } = props;

  const childrenTypes = useBlockChildrenTypes(block);
  const resourceTypes = getBlockResourceTypes(block, childrenTypes);

  const history = useHistory();
  const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
    `${blockPath}/:resourceType`
  );
  const resourceType =
    resourceTypeMatch && resourceTypeMatch.params.resourceType;
  const searchParams = new URLSearchParams(window.location.search);
  const boardType: BoardViewType = searchParams.get("bt") as BoardViewType;

  // TODO: show selected child route, like by adding background color or something
  // TODO: show count and use badges only for new unseen entries
  // TODO: sort the entries by count?

  // TODO: should we show error if block type is task?
  if (!boardType && resourceType) {
    const destPath = `${blockPath}/${resourceType}`;
    const boardTypesForResourceType = getBoardViewTypesForResourceType(
      block,
      resourceType,
      isMobile
    );
    const bt: BoardViewType = boardTypesForResourceType[0];

    return <Redirect to={`${destPath}?bt=${bt}`} />;
  }

  // TODO: should we show error if block type is task?
  if (boardType && !resourceType) {
    const nextPath = path.normalize(blockPath + `/tasks?bt={${boardType}}`);
    return <Redirect to={nextPath} />;
  }

  // TODO: should we show error if block type is task?
  if (!boardType && !resourceType) {
    const bt = getDefaultBoardViewType(block);
    const nextPath = path.normalize(blockPath + `/tasks?bt=${bt}`);
    return <Redirect to={nextPath} />;
  }

  const renderBoardType = () => {
    switch (boardType) {
      case "group-kanban":
        return (
          <BoardTypeKanban
            block={block}
            onClickUpdateBlock={onClickUpdateBlock}
            onClickBlock={onClickBlock}
            selectedResourceType={resourceType!}
            onClickCreateNewBlock={onClickAddBlock}
            onClickDeleteBlock={onClickDeleteBlock}
          />
        );

      case "status-kanban":
        return (
          <ViewByStatusContainer
            block={block}
            onClickUpdateBlock={onClickUpdateBlock}
          />
        );

      case "list":
        return (
          <BoardTypeList
            block={block}
            onClickUpdateBlock={onClickUpdateBlock}
            onClickBlock={onClickBlock}
            selectedResourceType={resourceType!}
            onClickCreateNewBlock={onClickAddBlock}
          />
        );
    }
  };

  const content: React.ReactNode = renderBoardType();

  const renderHeader = () => {
    return (
      <BoardBlockHeader
        isMobile={isMobile}
        block={block}
        selectedBoardType={boardType}
        resourceType={resourceType}
        onClickAddCollaborator={onClickAddCollaborator}
        onClickAddOrEditLabel={onClickAddOrEditLabel}
        onClickAddOrEditStatus={onClickAddOrEditStatus}
        onClickCreateNewBlock={(...args) => onClickAddBlock(block, ...args)}
        onClickDeleteBlock={() => onClickDeleteBlock(block)}
        onClickEditBlock={() => onClickUpdateBlock(block)}
        onNavigate={(navResourceType, navBoardType) => {
          let nextPath = `${blockPath}`;

          if (navResourceType) {
            nextPath = `${nextPath}/${navResourceType}`;
          }

          if (navBoardType) {
            nextPath = `${nextPath}?bt=${navBoardType}`;
          }

          history.push(nextPath);
        }}
        style={{ marginBottom: "20px", padding: "0 16px" }}
      />
    );
  };

  return (
    <StyledContainer s={{ flexDirection: "column", flex: 1, maxWidth: "100%" }}>
      {renderHeader()}
      <StyledContainer
        s={{
          overflow: "hidden",
          flex: 1,
        }}
      >
        {content}
      </StyledContainer>
    </StyledContainer>
  );
};

export default BoardMain;
