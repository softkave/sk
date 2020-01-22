import { Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
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
      <StyledContainer
        s={{ height: "100%", alignItems: "center", justifyContent: "center" }}
      >
        <Empty description={notFoundMessage || defaultNotFoundMessage} />
      </StyledContainer>
    );
  }

  return <BoardForBlock block={block} />;
};

export default BoardForBlockContainer;
