import React from "react";
import { useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";

export interface IBoardListProps {
    boards: IBlock[];

    searchQuery?: string;
    onClick?: (board: IBlock) => void;
}

const BoardList: React.FC<IBoardListProps> = (props) => {
    const { onClick, boards, searchQuery } = props;

    const boardRouteMatch = useRouteMatch<{ boardId: string }>(
        "/app/organizations/:orgId/boards/:boardId"
    );

    return (
        <BlockList
            searchQuery={searchQuery}
            blocks={boards}
            onClick={onClick}
            showFields={["name"]}
            emptyDescription="No boards available"
            getBlockStyle={(block) => {
                const selected =
                    block.customId === boardRouteMatch?.params.boardId;
                return {
                    padding: "8px 16px",
                    backgroundColor: selected ? "#bae7ff" : undefined,

                    "&:hover": {
                        backgroundColor: selected ? undefined : "#f0f0f0",
                    },
                };
            }}
        />
    );
};

export default BoardList;
