import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import EmptyMessage from "../EmptyMessage";
import Board from "./Board";

const defaultNotFoundMessage = "Block not found.";

export interface IBlockContainerProps {
  blockID: string;

  notFoundMessage?: string;
  render?: (block: IBlock) => React.ReactElement;
}

const BlockContainer: React.FC<IBlockContainerProps> = (props) => {
  const { blockID, notFoundMessage, render } = props;
  const block = useSelector<IReduxState, IBlock | undefined>((state) =>
    getBlock(state, blockID)
  );

  if (!block) {
    return (
      <EmptyMessage>{notFoundMessage || defaultNotFoundMessage}</EmptyMessage>
    );
  }

  return render!(block);
};

BlockContainer.defaultProps = {
  render(block) {
    return <Board block={block} />;
  },
};

export default BlockContainer;
