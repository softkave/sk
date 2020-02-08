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
import BoardTypeTabs from "./BoardTypeTabs";
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
  const sortedResourceTypes = sortBlockResourceTypesByCount(
    block,
    resourceTypes
  );

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

  if (!boardType) {
    let destPath = blockPath;

    if (resourceType) {
      destPath = `${blockPath}/${resourceType}`;
    }

    return <Redirect to={`${destPath}?bt=${"list"}`} />;
  }

  if (boardType !== "list" && !resourceType) {
    return (
      <Redirect to={`${blockPath}/${sortedResourceTypes[0]}?bt=${boardType}`} />
    );
  }

  const p = {
    block,
    resourceTypes,
    onClickUpdateBlock,
    onNavigate,
    onClickBlock,
    selectedResourceType: resourceType!
  };

  const renderBoardType = () => {
    switch (boardType) {
      case "kanban":
        return <BoardTypeKanban {...p} />;

      case "list":
        return <BoardTypeList {...p} />;

      case "tab":
        return <BoardTypeTabs {...p} />;
    }
  };

  const renderHeader = (types: BoardType[]) => {
    return (
      <BoardBlockHeader
        block={block}
        availableBoardTypes={types}
        selectedBoardType={boardType}
        resourceType={resourceType}
        onChangeBoardType={bt => {
          if (boardType !== bt) {
            let destPath = blockPath;

            if (resourceType) {
              destPath = `${blockPath}/${resourceType}`;
            }

            history.push(`${destPath}?bt=${bt}`);
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
          renderForDesktop={() => renderHeader(["kanban", "list", "tab"])}
          renderForMobile={() => renderHeader(["list", "tab"])}
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
        {renderBoardType()}
      </StyledContainer>
    </StyledContainer>
  );
};

export default BoardHomeForBlock;
