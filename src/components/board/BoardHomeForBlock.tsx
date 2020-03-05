import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import BoardBlockHeader from "./BoardBlockHeader";
import BoardTypeKanban from "./BoardTypeKanban";
import BoardTypeList from "./BoardTypeList";
import BoardLandingPage from "./LandingPage";
// import BoardTypeTabs from "./BoardTypeTabs";
import {
  BoardResourceType,
  BoardType,
  IBoardResourceTypePathMatch
} from "./types";
import { getBlockResourceTypes, sortBlockResourceTypesByCount } from "./utils";

export interface IBoardHomeForBlockProps {
  blockPath: string;
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickAddBlock: (type: BlockType) => void;
  onNavigate: (resourceType: BoardResourceType) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  onClickAddCollaborator: () => void;
  onClickDeleteBlock: (block: IBlock) => void;
}

const BoardHomeForBlock: React.FC<IBoardHomeForBlockProps> = props => {
  const {
    blockPath,
    block,
    onNavigate,
    onClickAddBlock,
    onClickAddCollaborator,
    onClickDeleteBlock,
    onClickUpdateBlock,
    onClickBlock
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
  const boardType: BoardType = searchParams.get("bt") as BoardType;

  // TODO: show selected child route, like by adding background color or something
  // TODO: show count and use badges only for new unseen entries
  // TODO: sort the entries by count?

  if (!boardType && resourceType) {
    const destPath = `${blockPath}/${resourceType}`;

    return <Redirect to={`${destPath}?bt=${"list"}`} />;
  }

  if (boardType && !resourceType) {
    return <Redirect to={`${blockPath}`} />;
  }

  const boardTypeProps = {
    block,
    onClickUpdateBlock,
    onClickBlock,
    selectedResourceType: resourceType!
  };

  const renderBoardType = () => {
    switch (boardType) {
      case "kanban":
        return <BoardTypeKanban {...boardTypeProps} />;

      case "list":
        return <BoardTypeList {...boardTypeProps} />;

      // case "tab":
      //   return <BoardTypeTabs {...p} />;
    }

    return null;
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

  const renderHeader = (types: BoardType[]) => {
    return (
      <BoardBlockHeader
        block={block}
        availableBoardTypes={types}
        selectedBoardType={boardType}
        resourceType={resourceType}
        onChangeBoardType={selectedBoardType => {
          if (boardType !== selectedBoardType) {
            let destPath = blockPath;

            if (resourceType) {
              destPath = `${blockPath}/${resourceType}`;
            } else if (
              selectedBoardType === "kanban" ||
              selectedBoardType === "tab"
            ) {
              const sortedResourceTypes = sortBlockResourceTypesByCount(
                block,
                resourceTypes
              );

              destPath = `${blockPath}/${sortedResourceTypes[0]}`;
            }

            history.push(`${destPath}?bt=${selectedBoardType}`);
          }
        }}
        onChangeKanbanResourceType={rt => {
          if (resourceType !== rt) {
            history.push(`${blockPath}/${rt}?bt=${boardType}`);
          }
        }}
        onClickAddCollaborator={onClickAddCollaborator}
        onClickCreateNewBlock={onClickAddBlock}
        onClickDeleteBlock={() => onClickDeleteBlock(block)}
        onClickEditBlock={() => onClickUpdateBlock(block)}
      />
    );
  };

  return (
    <StyledContainer s={{ flexDirection: "column", flex: 1, maxWidth: "100%" }}>
      <StyledContainer s={{ marginBottom: "20px", padding: "0 16px" }}>
        <RenderForDevice
          renderForDesktop={() => renderHeader(["kanban", "list" /*,"tab"*/])}
          renderForMobile={() => renderHeader(["list" /*,"tab"*/])}
        />
      </StyledContainer>
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          overflowX: "hidden",
          flex: 1
        }}
      >
        {content}
      </StyledContainer>
    </StyledContainer>
  );
};

export default BoardHomeForBlock;
