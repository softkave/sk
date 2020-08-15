import path from "path";
import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import BoardBlockHeader from "./BoardBlockHeader";
import BoardTypeList from "./BoardTypeList";
import {
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
  getBoardViewTypesForResourceType,
  getDefaultBoardViewType,
} from "./utils";
import ViewByStatusContainer from "./ViewByStatusContainer";

export interface IBoardHomeForBlockProps {
  blockPath: string;
  block: IBlock;
  isMobile: boolean;
  isMenuFolded: boolean;
  onToggleFoldMenu: () => void;
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
    onClickDeleteBlock,
    onClickUpdateBlock,
    onClickBlock,
    boardTypeSearchParamKey,
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
    if (resourceType === "boards" || resourceType === "tasks") {
      const destPath = `${blockPath}/${resourceType}`;
      const boardTypesForResourceType = getBoardViewTypesForResourceType(
        block,
        resourceType
      );
      const newBoardType: BoardViewType = boardTypesForResourceType[0];

      return (
        <Redirect
          to={`${destPath}?${boardTypeSearchParamKey}=${newBoardType}`}
        />
      );
    }
  }

  // TODO: should we show error if block type is task?
  if (boardType && !resourceType) {
    const nextPath = path.normalize(
      blockPath + `/tasks?${boardTypeSearchParamKey}=${boardType}`
    );
    return <Redirect to={nextPath} />;
  }

  // TODO: should we show error if block type is task?
  if (!boardType && !resourceType) {
    const newBoardType = getDefaultBoardViewType(block);
    const nextPath = path.normalize(
      blockPath + `/tasks?${boardTypeSearchParamKey}=${newBoardType}`
    );
    return <Redirect to={nextPath} />;
  }

  const renderBoardType = () => {
    switch (boardType) {
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
            onClickBlock={(blocks) =>
              onClickBlock(blocks, boardTypeSearchParamKey)
            }
            selectedResourceType={resourceType!}
            onClickCreateNewBlock={onClickAddBlock}
            style={{ marginTop: resourceTypes.length >= 2 ? "8px" : undefined }}
          />
        );
    }
  };

  const renderHeader = () => {
    return (
      <React.Fragment>
        <BoardBlockHeader
          {...props}
          selectedBoardType={boardType}
          resourceType={resourceType}
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
          style={{ padding: "16px" }}
        />
      </React.Fragment>
    );
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
      {renderBoardType()}
    </StyledContainer>
  );
};

BoardMain.defaultProps = {
  boardTypeSearchParamKey: "bt",
};

export default BoardMain;
