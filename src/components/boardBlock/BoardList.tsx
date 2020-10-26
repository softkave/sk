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
        "/app/orgs/:orgId/boards/:boardId"
    );

    return (
        <BlockList
            searchQuery={searchQuery}
            blocks={boards}
            onClick={onClick}
            showFields={["name"]}
            emptyDescription="No boards yets"
            getBlockStyle={(block) => {
                const selected =
                    block.customId === boardRouteMatch?.params.boardId;

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
                    // backgroundColor: selected ? "#bae7ff" : undefined,

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

export default BoardList;
