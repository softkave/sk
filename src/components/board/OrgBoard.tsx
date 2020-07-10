import { Input, Tabs } from "antd";
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
import BoardTypeList from "./BoardTypeList";
import LoadBlockChildren from "./LoadBlockChildren";
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

export interface IOrgBoardProps {
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
    onClickAddOrEditLabel,
    onClickAddOrEditStatus,
    boardTypeSearchParamKey,
    noExtraCreateMenuItems,
  } = props;

  const childrenTypes = useBlockChildrenTypes(block);
  const [searchQuery, setSearchQueries] = React.useState<{
    [key: string]: string;
  }>({});
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
  // if (!boardType && resourceType) {
  //   if (resourceType === "boards") {
  //     const destPath = `${blockPath}/${resourceType}`;
  //     const boardTypesForResourceType = getBoardViewTypesForResourceType(
  //       block,
  //       resourceType
  //     );
  //     const newBoardType: BoardViewType = boardTypesForResourceType[0];

  //     return (
  //       <Redirect
  //         to={`${destPath}?${boardTypeSearchParamKey}=${newBoardType}`}
  //       />
  //     );
  //   }
  // }

  // TODO: should we show error if block type is task?
  // if (boardType && !resourceType) {
  //   const nextPath = path.normalize(
  //     blockPath + `/tasks?${boardTypeSearchParamKey}=${boardType}`
  //   );
  //   return <Redirect to={nextPath} />;
  // }

  // TODO: should we show error if block type is task?
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
          size="small"
          placeholder={placeholder}
          prefix={
            <Search style={{ width: "8px", height: "16px", color: "#999" }} />
          }
          onChange={(evt) =>
            setSearchQueries({
              ...searchQuery,
              [resourceType]: evt.target.value,
            })
          }
        />
      </StyledContainer>
    );
  };

  const renderBoardType = () => {
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

  // Hello World!

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
              {renderBoardType()}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  };

  return (
    <StyledContainer
      s={{
        flex: 1,
        height: "100%",
        overflow: "hidden",
      }}
    >
      <StyledContainer
        s={{
          flexDirection: "column",
          height: "100%",
          width: "320px",
          borderRight: "1px solid #d9d9d9",
          backgroundColor: "#fefefe",

          ["& .ant-tabs"]: {
            height: "100%",
          },

          ["& .ant-tabs-content"]: {
            height: "100%",
          },

          ["& .ant-tabs-nav"]: {
            marginBottom: "8px",
          },
        }}
      >
        {renderTabs()}
      </StyledContainer>
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
              return (
                <LoadBlockChildren
                  parent={block}
                  type={BlockType.Board}
                  render={() => (
                    <BlockContainer
                      blockId={routeProps.match.params.boardId}
                      notFoundMessage="Board not found"
                    />
                  )}
                />
              );
            }}
          />
        </Switch>
      </StyledContainer>
    </StyledContainer>
  );
};

OrgBoard.defaultProps = {
  boardTypeSearchParamKey: "bt",
};

export default OrgBoard;
