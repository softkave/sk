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
}

const BoardTypeList: React.FC<IBoardTypeListProps> = (props) => {
  const {
    block,
    onClickUpdateBlock,
    onClickBlock,
    selectedResourceType,
  } = props;

  return (
    <StyledContainer
      s={{
        flexDirection: "column",
        height: "100%",
        flex: 1,
        width: "100%",
        padding: "0 16px",
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
