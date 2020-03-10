import React from "react";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import BoardTypeListForGroups from "./BoardTypeListForGroups";
import Children from "./Children";
import { BoardResourceType } from "./types";

export interface IBoardTypeListProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  selectedResourceType: BoardResourceType;
}

const BoardTypeList: React.FC<IBoardTypeListProps> = props => {
  const {
    block,
    onClickUpdateBlock,
    onClickBlock,
    selectedResourceType
  } = props;

  if (selectedResourceType === "groups") {
    return <BoardTypeListForGroups {...props} />;
  }

  return (
    <StyledContainer
      s={{
        flexDirection: "column",
        height: "100%",
        flex: 1,
        width: "100%",
        padding: "0 16px"
      }}
    >
      <Children
        block={block}
        onClickBlock={onClickBlock}
        onClickUpdateBlock={onClickUpdateBlock}
        selectedResourceType={selectedResourceType}
      />
    </StyledContainer>
  );
};

export default BoardTypeList;
