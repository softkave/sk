import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";

export interface IBoardListProps {
  boards: IBlock[];
  onClick?: (board: IBlock) => void;
}

const BoardList: React.FC<IBoardListProps> = (props) => {
  const { onClick, boards } = props;

  return (
    <BlockList
      blocks={boards}
      onClick={onClick}
      showFields={["name"]}
      emptyDescription="No boards available."
    />
  );
};

export default BoardList;
