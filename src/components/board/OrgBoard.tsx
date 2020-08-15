import { Input, Tabs } from "antd";
import { noop } from "lodash";
import path from "path";
import React from "react";
import { Plus, Search } from "react-feather";
import { Route, Switch, useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import BlockContainer from "./BlockContainer";
import BoardBlockHeader from "./BoardBlockHeader";
import BoardMain from "./BoardMain";
import BoardTypeList from "./BoardTypeList";
import LoadBlockChildren from "./LoadBlockChildren";
import {
  BoardResourceType,
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
  getBlockPath,
  getBlockResourceTypes,
  getBoardResourceTypeFullName,
  getBoardViewTypesForResourceType,
} from "./utils";

export interface IOrgBoardProps {
  blockPath: string;
  block: IBlock;
  isMobile: boolean;
  isAppMenuFolded: boolean;
  isOrgMenuFolded: boolean;
  onToggleFoldAppMenu: () => void;
  onToggleFoldOrgMenu: () => void;
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

const OrgBoard: React.FC<IOrgBoardProps> = (props) => {
  const {
    blockPath,
    block,
    onClickAddBlock,
    onClickAddCollaborator,
    onClickDeleteBlock,
    onClickUpdateBlock,
    onClickBlock,
    isMobile,
    boardTypeSearchParamKey,
    isAppMenuFolded,
    isOrgMenuFolded,
    onToggleFoldAppMenu,
    onToggleFoldOrgMenu,
  } = props;

  const history = useHistory();
  const childrenTypes = useBlockChildrenTypes(block);
  const [searchQueries, setSearchQueries] = React.useState<{
    [key: string]: string;
  }>({});
  const resourceTypes = getBlockResourceTypes(block, childrenTypes);
  const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
    `${blockPath}/:resourceType`
  );
  const resourceType =
    resourceTypeMatch && resourceTypeMatch.params.resourceType;

  if (!resourceType) {
    const nextPath = path.normalize(blockPath + `/boards`);
    return <Redirect to={nextPath} />;
  }

  const renderSearch = () => {
    let placeholder = "";

    switch (resourceType) {
      case "boards":
        placeholder = "Search boards...";
        break;

      case "collaboration-requests":
        placeholder = "Search requests...";
        break;

      case "collaborators":
        placeholder = "Search collaborators...";
        break;
    }

    return (
      <StyledContainer s={{ flex: 1, marginRight: "16px" }}>
        <Input
          allowClear
          placeholder={placeholder}
          prefix={
            <Search style={{ width: "16px", height: "16px", color: "#999" }} />
          }
          onChange={(evt) =>
            setSearchQueries({
              ...searchQueries,
              [resourceType]: evt.target.value,
            })
          }
        />
      </StyledContainer>
    );
  };

  const renderResourceType = () => {
    return (
      <StyledContainer
        s={{ height: "100%", width: "100%", flexDirection: "column" }}
      >
        <StyledContainer
          s={{
            alignItems: "center",
            padding: "0 16px",
            marginBottom: "8px",
            marginTop: "8px",
          }}
        >
          {renderSearch()}
          <Plus
            onClick={() => {
              switch (resourceType) {
                case "boards":
                  onClickAddBlock(block, BlockType.Board);
                  return;

                case "collaboration-requests":
                case "collaborators":
                  onClickAddCollaborator();
                  return;
              }
            }}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
        </StyledContainer>
        <BoardTypeList
          block={block}
          searchQuery={searchQueries[resourceType]}
          onClickBlock={(blocks) =>
            onClickBlock(blocks, boardTypeSearchParamKey)
          }
          onClickCreateNewBlock={onClickAddBlock}
          selectedResourceType={resourceType}
          style={{ flex: 1 }}
        />
      </StyledContainer>
    );
  };

  const onSelectResourceType = (key: BoardResourceType) => {
    let nextPath = `${blockPath}/${key}`;
    const viewTypes = getBoardViewTypesForResourceType(block, key);
    const search = new URLSearchParams(window.location.search);

    switch (key) {
      case "boards":
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

  const renderTabs = () => {
    return (
      <Tabs
        activeKey={resourceType!}
        onChange={(key) => onSelectResourceType(key as any)}
        tabBarGutter={0}
      >
        {resourceTypes.map((type, i) => {
          return (
            <Tabs.TabPane
              tab={
                <span
                  style={{
                    textTransform: "capitalize",
                    padding: "0 16px",
                  }}
                >
                  {getBoardResourceTypeFullName(type)}
                </span>
              }
              key={type}
            >
              {renderResourceType()}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  };

  const renderSelectedOrgView = () => {
    return (
      <StyledContainer
        s={{
          flex: 1,
          height: "100%",
          overflow: "hidden",
          flexDirection: "column",
          maxWidth: isMobile ? "100%" : "320px",
          borderRight: "1px solid #d9d9d9",
          backgroundColor: "#fefefe",

          ["& .ant-tabs"]: {
            height: "100%",
            width: isMobile ? "100%" : "320px",
          },

          ["& .ant-tabs-content"]: {
            height: "100%",
          },

          ["& .ant-tabs-content-holder"]: {
            overflow: "hidden",
          },

          ["& .ant-tabs-nav"]: {
            marginBottom: "8px",
          },
        }}
      >
        <BoardBlockHeader
          {...props}
          onClickAddCollaborator={noop}
          onClickAddOrEditLabel={noop}
          onClickAddOrEditStatus={noop}
          onClickCreateNewBlock={noop}
          onClickDeleteBlock={() => onClickDeleteBlock(block)}
          onClickEditBlock={() => onClickUpdateBlock(block)}
          onNavigate={noop}
          isMenuFolded={isAppMenuFolded}
          onToggleFoldMenu={onToggleFoldAppMenu}
          style={{
            padding: "16px",
            boxSizing: "border-box",
            borderBottom: "1px solid #d9d9d9",
            width: isMobile ? "100%" : "320px",
          }}
        />
        {renderTabs()}
      </StyledContainer>
    );
  };

  const ensureBoardsLoaded = (boardId: string) => {
    return (
      <LoadBlockChildren
        parent={block}
        type={BlockType.Board}
        render={() => (
          <BlockContainer
            blockId={boardId}
            notFoundMessage="Board not found"
            render={(board) => (
              <BoardMain
                {...props}
                block={board}
                blockPath={getBlockPath(board, blockPath)}
                isMenuFolded={isOrgMenuFolded}
                onClickDeleteBlock={(b) => onClickDeleteBlock(b)}
                onClickUpdateBlock={(b) => onClickUpdateBlock(b)}
                onToggleFoldMenu={onToggleFoldOrgMenu}
              />
            )}
          />
        )}
      />
    );
  };

  const renderMobileView = () => {
    return (
      <Switch>
        <Route
          path={`/app/organizations/${block.customId}/boards/:boardId`}
          render={(routeProps) => {
            return ensureBoardsLoaded(routeProps.match.params.boardId);
          }}
        />
        <Route
          path={`/app/organizations/${block.customId}`}
          render={renderSelectedOrgView}
        />
      </Switch>
    );
  };

  const renderDesktopView = () => {
    return (
      <StyledContainer
        s={{
          flex: 1,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {!isOrgMenuFolded && renderSelectedOrgView()}
        <StyledContainer
          s={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Switch>
            <Route
              path={`/app/organizations/${block.customId}/boards/:boardId`}
              render={(routeProps) => {
                return ensureBoardsLoaded(routeProps.match.params.boardId);
              }}
            />
          </Switch>
        </StyledContainer>
      </StyledContainer>
    );
  };

  if (isMobile) {
    return renderMobileView();
  } else {
    return renderDesktopView();
  }
};

OrgBoard.defaultProps = {
  boardTypeSearchParamKey: "bt",
};

export default OrgBoard;
