import { Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import BoardForBlock from "./BoardForBlock";

const defaultNotFoundMessage = "Block not found.";

export interface IBoardForBlockContainerProps {
  blockID: string;
  notFoundMessage?: string;
}

const BoardForBlockContainer: React.FC<IBoardForBlockContainerProps> = props => {
  const { blockID, notFoundMessage } = props;
  const block = useSelector<IReduxState, IBlock | undefined>(state =>
    getBlock(state, blockID)
  );

  if (!block) {
    return (
      <EmptyMessage>{notFoundMessage || defaultNotFoundMessage}</EmptyMessage>
    );
  }

  return <BoardForBlock block={block} />;
};

export default BoardForBlockContainer;
