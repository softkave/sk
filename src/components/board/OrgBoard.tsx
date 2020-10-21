/*eslint no-useless-computed-key: "off"*/

import { Badge, Tabs } from "antd";
import path from "path";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { Route, Switch, useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import ChatRoom from "../chat/ChatRoom";
import ChatRoomsContainer from "../chat/ChatRoomsContainer";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import OrgsListHeader from "../org/OrgsListHeader";
import StyledContainer from "../styled/Container";
import Scrollbar from "../utilities/Scrollbar";
import BlockContainer from "./BlockContainer";
import BoardContainer from "./BoardContainer";
import BoardTypeList from "./BoardTypeList";
import LoadBlockChildren from "./LoadBlockChildren";
import OrgBoardHeader from "./OrgBoardHeader";
import {
    BoardResourceType,
    IBoardResourceTypePathMatch,
    OnClickAddBlock,
    OnClickAddCollaborator,
    OnClickBlockWithSearchParamKey,
    OnClickDeleteBlock,
    OnClickUpdateBlock,
} from "./types";
import {
    getBlockPath,
    getBlockResourceTypes,
    getBoardResourceTypeDisplayName,
} from "./utils";

export interface IOrgBoardProps {
    blockPath: string;
    block: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    isOrgMenuFolded: boolean;
    unseenChatsCount: number;
    onToggleFoldAppMenu: () => void;
    onToggleFoldOrgMenu: () => void;
    onClickUpdateBlock: OnClickUpdateBlock;
    onClickAddBlock: OnClickAddBlock;
    onClickBlock: OnClickBlockWithSearchParamKey;
    onAddCollaborator: OnClickAddCollaborator;
    onClickDeleteBlock: OnClickDeleteBlock;
}

const OrgBoard: React.FC<IOrgBoardProps> = (props) => {
    const {
        blockPath,
        block,
        isMobile,
        isAppMenuFolded,
        isOrgMenuFolded,
        unseenChatsCount,
        onClickAddBlock,
        onAddCollaborator,
        onClickDeleteBlock,
        onClickUpdateBlock,
        onClickBlock,
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

    const renderResourceType = () => {
        let placeholder = "";
        let noAddBtn = false;

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

            case "chat":
                placeholder = "Search chats...";
                noAddBtn = true;
                break;
        }

        return (
            <StyledContainer
                s={{ height: "100%", width: "100%", flexDirection: "column" }}
            >
                <OrgsListHeader
                    onClickCreate={() => {
                        switch (resourceType) {
                            case "boards":
                                onClickAddBlock(block, BlockType.Board);
                                return;

                            case "collaboration-requests":
                            case "collaborators":
                                onAddCollaborator();
                                return;
                        }
                    }}
                    onSearchTextChange={(val) => {
                        setSearchQueries({
                            ...searchQueries,
                            [resourceType]: val,
                        });
                    }}
                    placeholder={placeholder}
                    style={{
                        padding: "0 16px",
                        marginBottom: "8px",
                        marginTop: "8px",
                    }}
                    noAddBtn={noAddBtn}
                />
                <Scrollbar>
                    <BoardTypeList
                        block={block}
                        searchQuery={searchQueries[resourceType]}
                        onClickBlock={(blocks) => onClickBlock(blocks)}
                        onClickCreateNewBlock={onClickAddBlock}
                        selectedResourceType={resourceType}
                        style={{ height: "100%" }}
                    />
                </Scrollbar>
            </StyledContainer>
        );
    };

    const onSelectResourceType = (key: BoardResourceType) => {
        const nextPath = `${blockPath}/${key}`;
        history.push(nextPath);
    };

    const renderTabs = () => {
        return (
            <Tabs
                activeKey={resourceType!}
                onChange={(key) => onSelectResourceType(key as any)}
                tabBarGutter={0}
                moreIcon={<MoreHorizontal />}
            >
                {resourceTypes.map((type) => {
                    const text = (
                        <span
                            style={{
                                textTransform: "capitalize",
                                padding: "0 16px",
                            }}
                        >
                            {getBoardResourceTypeDisplayName(type)}
                            {type === "chat" && (
                                <Badge
                                    count={unseenChatsCount}
                                    style={{
                                        marginLeft: "8px",
                                        display: "inline-block",
                                    }}
                                ></Badge>
                            )}
                        </span>
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
            <StyledContainer
                s={{
                    flex: 1,
                    height: "100%",
                    overflow: "hidden",
                    flexDirection: "column",
                    maxWidth: isMobile ? "100%" : "320px",
                    borderRight: "1px solid #d9d9d9",

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
                        marginBottom: "4px",
                    },
                }}
            >
                <OrgBoardHeader
                    {...props}
                    onClickEditBlock={() => onClickUpdateBlock(block)}
                    isAppMenuFolded={isAppMenuFolded}
                    onToggleFoldAppMenu={onToggleFoldAppMenu}
                    style={{
                        padding: "16px",
                        boxSizing: "border-box",
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
                            <BoardContainer
                                isMobile={isMobile}
                                block={board}
                                blockPath={getBlockPath(board, blockPath)}
                                isAppMenuFolded={isOrgMenuFolded}
                                onToggleFoldAppMenu={onToggleFoldOrgMenu}
                                onClickDeleteBlock={onClickDeleteBlock}
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
                orgId={block.customId}
                render={(args) => {
                    const room = args.sortedRooms.find(
                        (rm) => rm.recipientId === recipientId
                    )!;
                    return (
                        <ChatRoom
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
                    path={`/app/organizations/${block.customId}/boards/:boardId`}
                    render={(routeProps) => {
                        return ensureBoardsLoaded(
                            routeProps.match.params.boardId
                        );
                    }}
                />
                <Route
                    path={`/app/organizations/${block.customId}/chat/:recipientId`}
                    render={(routeProps) => {
                        const recipientId = routeProps.match.params.recipientId;
                        return renderChatsView(recipientId);
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
                                return ensureBoardsLoaded(
                                    routeProps.match.params.boardId
                                );
                            }}
                        />
                        <Route
                            path={`/app/organizations/${block.customId}/chat/:recipientId`}
                            render={(routeProps) => {
                                const recipientId =
                                    routeProps.match.params.recipientId;
                                return renderChatsView(recipientId);
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

export default OrgBoard;
