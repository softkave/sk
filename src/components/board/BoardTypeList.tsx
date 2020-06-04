import React from "react";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import RenderBlockChildren from "./RenderBlockChildren";
import { BoardResourceType, OnClickAddBlock, OnClickBlock } from "./types";

export interface IBoardTypeListProps {
  block: IBlock;
  selectedResourceType: BoardResourceType;
  onClickBlock: OnClickBlock;
  onClickCreateNewBlock: OnClickAddBlock;

  style?: React.CSSProperties;
}

const BoardTypeList: React.FC<IBoardTypeListProps> = (props) => {
  const { block, onClickBlock, selectedResourceType, style } = props;

  return (
    <StyledContainer
      style={style}
      s={{
        flexDirection: "column",
        flex: 1,
        width: "100%",
        padding: "0 16px",
        overflowY: "auto",
      }}
    >
      <RenderBlockChildren
        block={block}
        onClickBlock={onClickBlock}
        selectedResourceType={selectedResourceType}
      />
    </StyledContainer>
  );
};

export default BoardTypeList;
