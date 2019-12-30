import { Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import StyledCenterContainer from "../styled/CenterContainer";
import BoardForBlock from "./BoardForBlock";

const defaultNotFoundMessage = "Block not found.";

export interface IBoardEntryForBlockProps {
  blockID: string;
  notFoundMessage?: string;
}

const BoardEntryForBlock: React.FC<IBoardEntryForBlockProps> = props => {
  const { blockID, notFoundMessage } = props;
  const block = useSelector<IReduxState, IBlock | undefined>(state =>
    getBlock(state, blockID)
  );

  if (!block) {
    return (
      <StyledCenterContainer>
        <Empty description={notFoundMessage || defaultNotFoundMessage} />
      </StyledCenterContainer>
    );
  }

  return <BoardForBlock block={block} />;
};

export default BoardEntryForBlock;
