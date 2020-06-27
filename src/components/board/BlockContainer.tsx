import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/types";
import EmptyMessage from "../EmptyMessage";
import Board from "./Board";

const defaultNotFoundMessage = "Block not found.";

export interface IBlockContainerProps {
  blockId: string;

  notFoundMessage?: string;
  render?: (block: IBlock) => React.ReactElement;
}

const BlockContainer: React.FC<IBlockContainerProps> = (props) => {
  const { blockId, notFoundMessage, render } = props;
  const block = useSelector<IAppState, IBlock | undefined>((state) =>
    BlockSelectors.getBlock(state, blockId)
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
