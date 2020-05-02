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
// import BoardTypeTabs from "./BoardTypeTabs";
import {
  BoardResourceType,
  BoardType,
  IBoardResourceTypePathMatch,
} from "./types";
import {
  getBlockLandingPage,
  getBlockResourceTypes,
  getBoardTypesForResourceType,
} from "./utils";

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

const BoardHomeForBlock: React.FC<IBoardHomeForBlockProps> = (props) => {
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

  const [isFirstRender, setIsFirstRender] = React.useState(true);

  const childrenTypes = useBlockChildrenTypes(block);
  const resourceTypes = getBlockResourceTypes(block, childrenTypes);

  const history = useHistory();
  const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
    `${blockPath}/:resourceType`
  );
  const resourceType =
    resourceTypeMatch && resourceTypeMatch.params.resourceType;
  const searchParams = new URLSearchParams(window.location.search);
  const boardType: BoardType = searchParams.get("bt") as BoardType;

  // TODO: show selected child route, like by adding background color or something
  // TODO: show count and use badges only for new unseen entries
  // TODO: sort the entries by count?

  React.useEffect(() => {
    if (isFirstRender) {
      const landingPage = getBlockLandingPage(block) || block.landingPage;

      if (!resourceType && landingPage && landingPage !== "self") {
        const boardTypesForResourceType = getBoardTypesForResourceType(
          block,
          landingPage,
          isMobile
        );

        const bt: BoardType = boardTypesForResourceType[0];
        const path = `${blockPath}/${landingPage}?bt=${bt}`;
        history.push(path);
      }

      setIsFirstRender(false);
    }
  }, [
    isFirstRender,
    setIsFirstRender,
    history,
    resourceType,
    block,
    blockPath,
    isMobile,
  ]);

  if (isFirstRender) {
    return null;
  }

  if (!boardType && resourceType) {
    const destPath = `${blockPath}/${resourceType}`;
    const boardTypesForResourceType = getBoardTypesForResourceType(
      block,
      resourceType,
      isMobile
    );
    const bt: BoardType = boardTypesForResourceType[0];

    return <Redirect to={`${destPath}?bt=${bt}`} />;
  }

  if (boardType && !resourceType) {
    return <Redirect to={`${blockPath}`} />;
  }

  const renderBoardType = () => {
    switch (boardType) {
      case "kanban":
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

      case "tab":
        // TODO:
        return null;
      //   return <BoardTypeTabs {...p} />;
    }
  };

  let content: React.ReactNode = null;

  if (!resourceType) {
    content = (
      <BoardLandingPage
        block={block}
        onNavigate={onNavigate}
        resourceTypes={resourceTypes}
      />
    );
  } else {
    content = renderBoardType();
  }

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
          let path = `${blockPath}`;

          if (navResourceType) {
            path = `${path}/${navResourceType}`;
          }

          if (navBoardType) {
            path = `${path}?bt=${navBoardType}`;
          }

          history.push(path);
        }}
      />
    );
  };

  return (
    <StyledContainer s={{ flexDirection: "column", flex: 1, maxWidth: "100%" }}>
      <StyledContainer s={{ marginBottom: "20px", padding: "0 16px" }}>
        {renderHeader()}
      </StyledContainer>
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          overflowX: "hidden",
          flex: 1,
        }}
      >
        {content}
      </StyledContainer>
    </StyledContainer>
  );
};

export default BoardHomeForBlock;
