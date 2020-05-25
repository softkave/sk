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
import {
  BoardResourceType,
  BoardViewType,
  IBoardResourceTypePathMatch,
} from "./types";
import {
  getBlockResourceTypes,
  getBoardResourceTypeFullName,
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
    if (
      resourceType === "collaboration-requests" ||
      resourceType === "collaborators" ||
      resourceType === "groups"
    ) {
      return (
        <BoardTypeList
          block={block}
          onClickBlock={onClickBlock}
          onClickCreateNewBlock={onClickAddBlock}
          onClickUpdateBlock={onClickUpdateBlock}
          selectedResourceType={resourceType}
          style={{ marginTop: "8px" }}
        />
      );
    }

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
            style={{ marginTop: "8px", flex: 1 }}
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
            style={{ marginTop: "8px" }}
          />
        );
    }
  };

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
        style={{ marginBottom: "24px", padding: "0 16px" }}
      />
    );
  };

  const onSelectResourceType = (key: BoardResourceType) => {
    let nextPath = `${blockPath}/${key}`;
    const viewTypes = getBoardViewTypesForResourceType(block, key);

    switch (key) {
      case "groups":
      case "projects":
      case "tasks":
        if (viewTypes && viewTypes.length > 0) {
          nextPath = `${nextPath}?bt=${viewTypes[0]}`;
        }

        history.push(nextPath);
        break;

      case "collaboration-requests":
      case "collaborators":
        history.push(nextPath);
        break;
    }
  };

  return (
    <StyledContainer
      s={{
        flexDirection: "column",
        flex: 1,
        maxWidth: "100%",
      }}
    >
      {renderHeader()}
      <StyledContainer
        s={{
          flexWrap: "nowrap",
          overflowX: "auto",
        }}
      >
        {resourceTypes.map((type, i) => {
          return (
            <StyledContainer
              key={type}
              s={{
                marginRight: "24px",
                marginLeft: i === 0 ? "16px" : undefined,
                color: type === resourceType ? "rgb(66,133,244)" : "inherit",
                cursor: "pointer",
              }}
              onClick={() => {
                onSelectResourceType(type);
              }}
            >
              {getBoardResourceTypeFullName(type)}
            </StyledContainer>
          );
        })}
      </StyledContainer>
      {renderBoardType()}
    </StyledContainer>
  );
};

export default BoardMain;
