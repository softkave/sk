import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import RenderBlockChildren from "./RenderBlockChildren";
import { BoardResourceType } from "./types";

export interface IBoardTypeListProps {
  block: IBlock;
  selectedResourceType: BoardResourceType;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  onClickCreateNewBlock: (block: IBlock, type: BlockType) => void;

  style?: React.CSSProperties;
}

const BoardTypeList: React.FC<IBoardTypeListProps> = (props) => {
  const {
    block,
    onClickUpdateBlock,
    onClickBlock,
    selectedResourceType,
    style,
  } = props;

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
        onClickUpdateBlock={onClickUpdateBlock}
        selectedResourceType={selectedResourceType}
      />
    </StyledContainer>
  );
};

export default BoardTypeList;
