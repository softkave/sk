import React from "react";
import { useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import BlockGrid from "../block/BlockGrid";
import BlockList from "../block/BlockList";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";

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
      getBlockStyle={(block, i) => {
        return {
          padding: "8px 16px",
          backgroundColor:
            block.customId === boardRouteMatch?.params.boardId
              ? "#eee"
              : undefined,

          "&:hover": {
            backgroundColor: "#eee",
          },
        };
      }}
    />
  );
};

export default BoardList;
