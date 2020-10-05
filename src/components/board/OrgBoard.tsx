/*eslint no-useless-computed-key: "off"*/

import { Badge, Tabs } from "antd";
import { noop } from "lodash";
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
import CustomScrollbar from "../utilities/DeviceScrollbar";
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
    onClickAddCollaborator: OnClickAddCollaborator;
    onClickAddOrEditLabel: OnClickAddOrEditLabel;
    onClickAddOrEditStatus: OnClickAddOrEditStatus;
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
        onClickAddCollaborator,
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
                                onClickAddCollaborator();
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
                />
                <CustomScrollbar>
                    <BoardTypeList
                        block={block}
                        searchQuery={searchQueries[resourceType]}
                        onClickBlock={(blocks) => onClickBlock(blocks)}
                        onClickCreateNewBlock={onClickAddBlock}
                        selectedResourceType={resourceType}
                        style={{ height: "100%" }}
                    />
                </CustomScrollbar>
            </StyledContainer>
        );
    };

    const onSelectResourceType = (key: BoardResourceType) => {
        const nextPath = `${blockPath}/${key}`;

        switch (key) {
            case "boards":
            case "tasks":
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
                            {getBoardResourceTypeFullName(type)}
                        </span>
                    );

                    const content =
                        type === "chat" ? (
                            <Badge count={unseenChatsCount}>{text}</Badge>
                        ) : (
                            { text }
                        );

                    return (
                        <Tabs.TabPane tab={content} key={type}>
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
                            <BoardMain
                                {...props}
                                block={board}
                                blockPath={getBlockPath(board, blockPath)}
                                isAppMenuFolded={isOrgMenuFolded}
                                onClickDeleteBlock={(b) =>
                                    onClickDeleteBlock(b)
                                }
                                onClickUpdateBlock={(b) =>
                                    onClickUpdateBlock(b)
                                }
                                onToggleFoldAppMenu={onToggleFoldOrgMenu}
                            />
                        )}
                    />
                )}
            />
        );
    };

    const renderChatsView = (roomId: string) => {
        return (
            <ChatRoomsContainer
                orgId={block.customId}
                render={(args) => {
                    const room = args.sortedRooms.find(
                        (rm) => rm.customId === roomId
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
                    path={`/app/organizations/${block.customId}/chat/:roomId`}
                    render={(routeProps) => {
                        const roomId = routeProps.match.params.roomId;
                        return renderChatsView(roomId);
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
                            path={`/app/organizations/${block.customId}/chat/:roomId`}
                            render={(routeProps) => {
                                const roomId = routeProps.match.params.roomId;
                                return renderChatsView(roomId);
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
