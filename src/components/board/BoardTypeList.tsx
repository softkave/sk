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
  searchQuery?: string;
}

const BoardTypeList: React.FC<IBoardTypeListProps> = (props) => {
  const { block, onClickBlock, selectedResourceType, style, searchQuery } =
    props;

  return (
    <StyledContainer
      style={style}
      s={{
        flex: 1,
        flexDirection: "column",
        width: "100%",
      }}
    >
      <RenderBlockChildren
        searchQuery={searchQuery}
        block={block}
        onClickBlock={onClickBlock}
        selectedResourceType={selectedResourceType}
      />
    </StyledContainer>
  );
};

export default BoardTypeList;
