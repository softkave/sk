import { css } from "@emotion/css";
import { List } from "antd";
import React from "react";
import { useRouteMatch } from "react-router";
import { IBoard } from "../../models/board/types";
import { appOrganizationRoutes } from "../../models/organization/utils";
import Message from "../PageError";
import BoardThumnail from "./BoardThumnail";

export interface IBoardListProps {
  organizationId: string;
  boards: IBoard[];
  searchQuery?: string;
  onClick: (board: IBoard) => void;
}

const classes = {
  item: css({
    cursor: "pointer",
    padding: "8px 16px",
  }),
};

const BoardList: React.FC<IBoardListProps> = (props) => {
  const { onClick, boards, searchQuery, organizationId } = props;
  const boardRouteMatch = useRouteMatch<{ boardId: string }>(
    `${appOrganizationRoutes.boards(organizationId)}/:boardId`
  );

  const filteredBoards = React.useMemo(() => {
    if (!searchQuery) {
      return boards;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return boards.filter((item) =>
      item.name?.toLowerCase().includes(lowerQuery)
    );
  }, [boards, searchQuery]);

  if (boards.length === 0) {
    return <Message message={"Create a board to get started."} />;
  }

  if (filteredBoards.length === 0) {
    return <Message message={"Board not found."} />;
  }

  return (
    <List
      dataSource={filteredBoards}
      renderItem={(board, i) => (
        <BoardThumnail
          key={board.customId}
          className={classes.item}
          isSelected={board.customId === boardRouteMatch?.params.boardId}
          board={board}
          onClick={() => onClick(board)}
        />
      )}
    />
  );
};

export default React.memo(BoardList);
