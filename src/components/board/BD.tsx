import { Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import BA from "../board/BA";
import StyledCenterContainer from "../styled/CenterContainer";

const defaultNotFoundMessage = "Block not found.";

export interface IBDProps {
  blockID: string;
  notFoundMessage?: string;
}

const BD: React.FC<IBDProps> = props => {
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

  return <BA block={block} />;
};

export default BD;
