import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import BoardList from "../boardBlock/BoardList";
import ChatRoomsContainer, {
    IChatRoomsRenderProps,
} from "../chat/ChatRoomsContainer";
import RoomsList from "../chat/RoomsList";
import CollaborationRequests from "../collaborator/CollaborationRequests";
import CollaboratorList from "../collaborator/CollaboratorList";
import LoadBlockChildren from "./LoadBlockChildren";
import { BoardResourceType } from "./types";

export interface IRenderBlockChildrenProps {
    block: IBlock;
    selectedResourceType: BoardResourceType;
    onClickBlock: (blocks: IBlock[]) => void;

    searchQuery?: string;
}

const RenderBlockChildren: React.FC<IRenderBlockChildrenProps> = (props) => {
    const { block, onClickBlock, selectedResourceType, searchQuery } = props;

    const renderCollaborators = () => {
        return (
            <CollaboratorList
                searchQuery={searchQuery}
                organization={block}
                getCollaboratorStyle={() => ({ padding: "8px 16px" })}
            />
        );
    };

    const renderCollaborationRequests = () => {
        return (
            <CollaborationRequests
                searchQuery={searchQuery}
                organization={block}
                getRequestStyle={() => ({ padding: "8px 16px" })}
            />
        );
    };

    const renderRoomsList = (args: IChatRoomsRenderProps) => {
        return (
            <RoomsList
                searchQuery={searchQuery}
                sortedRooms={args.sortedRooms}
                recipientsMap={args.recipientsMap}
                onSelectRoom={args.onSelectRoom}
                getRoomStyle={(room) => {
                    const selected =
                        room.recipientId === args.selectedRoomRecipientId;

                    let color: string | undefined;
                    let backgroundColor: string | undefined;

                    if (selected) {
                        color = "#1890ff";
                        backgroundColor = "#e6f7ff";
                    }

                    return {
                        backgroundColor,
                        color,
                        cursor: "pointer",
                        padding: "8px 16px",

                        "&:hover": {
                            backgroundColor,
                        },

                        "& .ant-typography": {
                            color,
                        },
                    };
                }}
            />
        );
    };

    const renderChatRoomsList = () => {
        return (
            <ChatRoomsContainer
                orgId={block.customId}
                render={renderRoomsList}
            />
        );
    };

    switch (selectedResourceType) {
        case "collaboration-requests":
            return renderCollaborationRequests();

        case "collaborators":
            return renderCollaborators();

        case "boards":
            return (
                <LoadBlockChildren
                    parent={block}
                    type={BlockType.Board}
                    render={(blocks) => (
                        <BoardList
                            searchQuery={searchQuery}
                            boards={blocks}
                            onClick={(board) => onClickBlock([board])}
                        />
                    )}
                />
            );

        case "chat":
            return renderChatRoomsList();
    }

    return null;
};

export default React.memo(RenderBlockChildren);
