import path from "path";
import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import BoardBlockHeader from "./BoardBlockHeader";
import BoardGroupList from "./BoardGroupList";
import BoardTypeKanban from "./BoardTypeKanban";
import BoardTypeList from "./BoardTypeList";
import {
  BoardResourceType,
  BoardViewType,
  IBoardResourceTypePathMatch,
  OnClickAddBlock,
  OnClickAddCollaborator,
  OnClickAddOrEditLabel,
  OnClickAddOrEditStatus,
  OnClickBlockWithSearchParamKey,
  OnClickDeleteBlock,
  OnClickUpdateBlock,
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
  onClickUpdateBlock: OnClickUpdateBlock;
  onClickAddBlock: OnClickAddBlock;
  onClickBlock: OnClickBlockWithSearchParamKey;
  onClickAddCollaborator: OnClickAddCollaborator;
  onClickAddOrEditLabel: OnClickAddOrEditLabel;
  onClickAddOrEditStatus: OnClickAddOrEditStatus;
  onClickDeleteBlock: OnClickDeleteBlock;

  noExtraCreateMenuItems?: boolean;
  boardTypeSearchParamKey?: string;
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
    boardTypeSearchParamKey,
    noExtraCreateMenuItems,
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
  const boardType: BoardViewType = searchParams.get(
    boardTypeSearchParamKey!
  ) as BoardViewType;

  // TODO: show selected child route, like by adding background color or something
  // TODO: show count and use badges only for new unseen entries
  // TODO: sort the entries by count?

  // TODO: should we show error if block type is task?
  if (!boardType && resourceType) {
    console.log("a", block);
    return null;
    // const destPath = `${blockPath}/${resourceType}`;
    // const boardTypesForResourceType = getBoardViewTypesForResourceType(
    //   block,
    //   resourceType,
    //   isMobile
    // );
    // const newBoardType: BoardViewType = boardTypesForResourceType[0];

    // return (
    //   <Redirect to={`${destPath}?${boardTypeSearchParamKey}=${newBoardType}`} />
    // );
  }

  // TODO: should we show error if block type is task?
  if (boardType && !resourceType) {
    console.log("b", block);
    const nextPath = path.normalize(
      blockPath + `/tasks?${boardTypeSearchParamKey}=${boardType}`
    );
    return <Redirect to={nextPath} />;
  }

  // TODO: should we show error if block type is task?
  if (!boardType && !resourceType) {
    console.log("c", block);
    const newBoardType = getDefaultBoardViewType(block);
    const nextPath = path.normalize(
      blockPath + `/tasks?${boardTypeSearchParamKey}=${newBoardType}`
    );
    return <Redirect to={nextPath} />;
  }

  const renderBoardType = () => {
    if (resourceType === "groups") {
      return (
        <BoardGroupList
          block={block}
          blockPath={blockPath}
          onClickBlock={onClickBlock}
          onClickCreateNewBlock={onClickAddBlock}
          onClickDeleteBlock={onClickDeleteBlock}
          onClickUpdateBlock={onClickUpdateBlock}
          style={{ marginTop: "8px" }}
        />
      );
    }

    if (
      resourceType === "collaboration-requests" ||
      resourceType === "collaborators"
    ) {
      return (
        <BoardTypeList
          block={block}
          onClickBlock={(blocks) =>
            onClickBlock(blocks, boardTypeSearchParamKey)
          }
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
            onClickBlock={(blocks) =>
              onClickBlock(blocks, boardTypeSearchParamKey)
            }
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
            onClickBlock={(blocks) =>
              onClickBlock(blocks, boardTypeSearchParamKey)
            }
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
        noExtraCreateMenuItems={noExtraCreateMenuItems}
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
            nextPath = `${nextPath}?${boardTypeSearchParamKey}=${navBoardType}`;
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
    const search = new URLSearchParams(window.location.search);

    switch (key) {
      case "groups":
      case "projects":
      case "tasks":
        if (viewTypes && viewTypes.length > 0) {
          search.set(boardTypeSearchParamKey!, viewTypes[0]);
          nextPath = `${nextPath}?${search.toString()}`;
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
                whiteSpace: "nowrap",
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

BoardMain.defaultProps = {
  boardTypeSearchParamKey: "bt",
};

export default BoardMain;
