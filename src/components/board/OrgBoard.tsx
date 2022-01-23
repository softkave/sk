/*eslint no-useless-computed-key: "off"*/

import { Badge, Space, Tabs, Typography } from "antd";
import React from "react";
import { RightOutlined } from "@ant-design/icons";
import { Route, Switch, useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { BlockType } from "../../models/block/block";
import ChatRoom from "../chat/ChatRoom";
import ChatRoomsContainer, {
  IChatRoomsRenderProps,
} from "../chat/ChatRoomsContainer";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import Message from "../Message";
import OrgsListHeader from "../org/OrgsListHeader";
import BlockContainer from "./BlockContainer";
import BoardContainer from "./BoardContainer";
import LoadBlockChildren from "./LoadBlockChildren";
import OrgBoardHeader from "./OrgBoardHeader";
import { IBoardResourceTypePathMatch, OnClickAddCollaborator } from "./types";
import {
  getBlockPath,
  getBlockResourceTypes,
  getBoardResourceTypeDisplayName,
} from "./utils";
import { IAppOrganization } from "../../models/organization/types";
import { IBoard } from "../../models/board/types";
import { appOrganizationRoutes } from "../../models/organization/utils";
import BoardListContainer from "./BoardListContainer";
import CollaboratorList from "../collaborator/CollaboratorList";
import CollaborationRequestListContainer from "../collaborator/CollaborationRequestListContainer";
import { noop } from "lodash";
import { css, cx } from "@emotion/css";
import RoomsList from "../chat/RoomsList";
import { assert } from "console";
import { messages } from "../../models/messages";

export interface IOrgBoardProps {
  organization: IAppOrganization;
  isMobile: boolean;
  isAppMenuFolded: boolean;
  isOrgMenuFolded: boolean;
  unseenChatsCount: number;
  onToggleFoldAppMenu: () => void;
  onToggleFoldOrgMenu: () => void;
  onClickUpdateOrganization: () => void;
  onClickAddBoard: () => void;
  onClickBoard: (board: IBoard, searchParamKey?: string) => void;
  onAddCollaborator: OnClickAddCollaborator;
  onClickDeleteBoard: (board: IBoard) => void;
}

const classes = {
  resourceType: css({ height: "100%", width: "100%", flexDirection: "column" }),
  orgListHeader: css({
    padding: "0 16px",
    marginBottom: "8px",
    marginTop: "8px",
  }),
  selectedOrgViewRoot: css({
    flex: 1,
    height: "100%",
    overflow: "hidden",
    flexDirection: "column",
    borderRight: "1px solid rgb(223, 234, 240)",

    ["& .ant-tabs"]: {
      height: "100%",
    },

    ["& .ant-tabs-content"]: {
      height: "100%",
    },

    ["& .ant-tabs-content-holder"]: {
      overflow: "hidden",
    },

    ["& .ant-tabs-nav"]: {
      marginBottom: "4px",
    },

    ["& .ant-tabs-nav-more > .anticon-ellipsis"]: {
      verticalAlign: "middle",
    },
  }),
  selectedOrgViewRootMobile: css({
    maxWidth: "100%",

    ["& .ant-tabs"]: {
      width: "100%",
    },
  }),
  selectedOrgViewRootDesktop: css({
    maxWidth: "280px",

    ["& .ant-tabs"]: {
      width: "280px",
    },
  }),
  selectOrgView: css({
    padding: "16px",
    boxSizing: "border-box",
  }),
  selectOrgViewMobile: css({
    width: "100%",
  }),
  selectOrgViewDesktop: css({
    padding: "16px",
    boxSizing: "border-box",
    width: "320px",
  }),
  rootDesktop: css({
    flex: 1,
    height: "100%",
    overflow: "hidden",
  }),
  rootContentDesktop: css({
    flex: 1,
    overflow: "hidden",
  }),
};

const OrgBoard: React.FC<IOrgBoardProps> = (props) => {
  const {
    organization,
    isMobile,
    isAppMenuFolded,
    isOrgMenuFolded,
    unseenChatsCount,
    onClickAddBoard,
    onAddCollaborator,
    onClickDeleteBoard,
    onClickUpdateOrganization,
    onClickBoard,
    onToggleFoldAppMenu,
    onToggleFoldOrgMenu,
  } = props;

  const history = useHistory();
  const childrenTypes = useBlockChildrenTypes(organization);
  const [searchQueries, setSearchQueries] = React.useState<{
    [key: string]: string;
  }>({});

  const resourceTypes = getBlockResourceTypes(organization, childrenTypes);
  const organizationPath = appOrganizationRoutes.organization(
    organization.customId
  );

  const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
    `${organizationPath}/:resourceType`
  );

  const resourceType =
    resourceTypeMatch && resourceTypeMatch.params.resourceType;

  const onClickCreate = React.useCallback(() => {
    assert(resourceType, messages.anErrorOccurred);
    switch (resourceType) {
      case "boards":
        onClickAddBoard();
        return;

      case "collaboration-requests":
      case "collaborators":
        onAddCollaborator();
        return;
    }
  }, [resourceType, onClickAddBoard, onAddCollaborator]);

  const onSearchTextChange = React.useCallback(
    (val) => {
      assert(resourceType, messages.anErrorOccurred);
      setSearchQueries({
        ...searchQueries,
        [resourceType as string]: val,
      });
    },
    [resourceType, searchQueries]
  );

  const onSelectResourceType = React.useCallback(
    (key: string) => {
      const nextPath = `${organizationPath}/${key}`;
      history.push(nextPath);
    },
    [organizationPath, history]
  );

  if (!resourceType) {
    const defaultPath = appOrganizationRoutes.boards(organization.customId);
    return <Redirect to={defaultPath} />;
  }

  const renderBoardList = () => {
    return (
      <BoardListContainer
        organizationId={organization.customId}
        searchQuery={searchQueries[resourceType]}
        onClick={onClickBoard}
      />
    );
  };

  const renderCollaboratorList = () => {
    return (
      <CollaboratorList
        organization={organization}
        searchQuery={searchQueries[resourceType]}
      />
    );
  };

  const renderCollaborationRequestList = () => {
    return (
      <CollaborationRequestListContainer
        organizationId={organization.customId}
        searchQuery={searchQueries[resourceType]}
        onClickRequest={noop}
      />
    );
  };

  const renderRoomsList = (args: IChatRoomsRenderProps) => {
    return (
      <RoomsList
        searchQuery={searchQueries[resourceType]}
        selectedRoomRecipientId={args.selectedRoomRecipientId}
        sortedRooms={args.sortedRooms}
        recipientsMap={args.recipientsMap}
        onSelectRoom={args.onSelectRoom}
      />
    );
  };

  const renderChatRoomsList = () => {
    return (
      <ChatRoomsContainer
        orgId={organization.customId}
        render={renderRoomsList}
      />
    );
  };

  const renderResourceType = () => {
    let placeholder,
      title = "",
      noAddBtn = false,
      node: React.ReactNode = null;

    switch (resourceType) {
      case "boards": {
        placeholder = "Search boards...";
        title = "Boards";
        node = renderBoardList();
        break;
      }

      case "collaboration-requests": {
        placeholder = "Search requests...";
        title = "Requests";
        node = renderCollaborationRequestList();
        break;
      }

      case "collaborators": {
        placeholder = "Search collaborators...";
        title = "Collaborators";
        node = renderCollaboratorList();
        break;
      }

      case "chat": {
        placeholder = "Search chats...";
        noAddBtn = true;
        title = "Chat";
        node = renderChatRoomsList();
        break;
      }
    }

    return (
      <div className={classes.resourceType}>
        <OrgsListHeader
          onClickCreate={onClickCreate}
          onSearchTextChange={onSearchTextChange}
          placeholder={placeholder}
          className={classes.orgListHeader}
          noAddBtn={noAddBtn}
          title={title}
        />
        {node}
      </div>
    );
  };

  const renderTabs = () => {
    assert(resourceType, messages.anErrorOccurred);
    return (
      <Tabs
        activeKey={resourceType}
        onChange={onSelectResourceType}
        tabBarGutter={0}
        moreIcon={
          <Typography.Text type="secondary">
            <RightOutlined />
          </Typography.Text>
        }
      >
        {resourceTypes.map((type) => {
          const text = (
            <Space>
              {getBoardResourceTypeDisplayName(type)}
              {type === "chat" && <Badge count={unseenChatsCount}></Badge>}
            </Space>
          );

          return (
            <Tabs.TabPane tab={text} key={type}>
              {renderResourceType()}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  };

  const renderSelectedOrgView = () => {
    return (
      <div
        className={cx(classes.selectedOrgViewRoot, {
          [classes.selectedOrgViewRootMobile]: isMobile,
          [classes.selectedOrgViewRootDesktop]: !isMobile,
        })}
      >
        <OrgBoardHeader
          {...props}
          onClickEditBlock={onClickUpdateOrganization}
          isAppMenuFolded={isAppMenuFolded}
          onToggleFoldAppMenu={onToggleFoldAppMenu}
          className={cx(classes.selectOrgView, {
            [classes.selectOrgViewMobile]: isMobile,
            [classes.selectOrgViewDesktop]: !isMobile,
          })}
        />
        {renderTabs()}
      </div>
    );
  };

  const ensureBoardsAreLoaded = (boardId: string) => {
    return (
      <LoadBlockChildren
        parent={organization}
        type={BlockType.Board}
        render={() => (
          <BlockContainer
            blockId={boardId}
            notFoundMessage="Board not found."
            render={(board) => (
              <BoardContainer
                isMobile={isMobile}
                board={board}
                blockPath={getBlockPath(board, organizationPath)}
                isAppMenuFolded={isOrgMenuFolded}
                onToggleFoldAppMenu={onToggleFoldOrgMenu}
                onClickDeleteBlock={onClickDeleteBoard}
              />
            )}
          />
        )}
      />
    );
  };

  const renderChatsView = (recipientId: string) => {
    return (
      <ChatRoomsContainer
        orgId={organization.customId}
        render={(args) => {
          const room = args.sortedRooms.find(
            (rm) => rm.recipientId === recipientId
          )!;
          return (
            <ChatRoom
              isAppHidden={args.isAppHidden}
              user={args.user}
              room={room}
              recipientsMap={args.recipientsMap}
              onSendMessage={args.onSendMessage}
              updateRoomReadCounter={args.updateRoomReadCounter}
            />
          );
        }}
      />
    );
  };

  const renderMobileView = () => {
    return (
      <Switch>
        <Route
          path={`/app/orgs/${organization.customId}/boards/:boardId`}
          render={(routeProps) => {
            return ensureBoardsAreLoaded(routeProps.match.params.boardId);
          }}
        />
        <Route
          path={`/app/orgs/${organization.customId}/chat/:recipientId`}
          render={(routeProps) => {
            const recipientId = routeProps.match.params.recipientId;
            return renderChatsView(recipientId);
          }}
        />
        <Route
          path={`/app/orgs/${organization.customId}`}
          render={renderSelectedOrgView}
        />
      </Switch>
    );
  };

  const renderEmpty = () => <Message message={organization.name} />;
  const renderDesktopView = () => {
    return (
      <div className={classes.rootDesktop}>
        {!isOrgMenuFolded && renderSelectedOrgView()}
        <div className={classes.rootContentDesktop}>
          <Switch>
            <Route
              path={`${appOrganizationRoutes.boards(
                organization.customId
              )}/:boardId`}
              render={(routeProps) => {
                return ensureBoardsAreLoaded(routeProps.match.params.boardId);
              }}
            />
            <Route
              path={`${appOrganizationRoutes.chats(
                organization.customId
              )}/:recipientId`}
              render={(routeProps) => {
                const recipientId = routeProps.match.params.recipientId;
                return renderChatsView(recipientId);
              }}
            />
            <Route
              path={appOrganizationRoutes.organization(organization.customId)}
              render={renderEmpty}
            />
          </Switch>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return renderMobileView();
  } else {
    return renderDesktopView();
  }
};

export default React.memo(OrgBoard);
