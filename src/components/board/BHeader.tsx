import { noop } from "lodash";
import React from "react";
import BoardBlockHeader from "./BoardBlockHeader";
import { IOrgBoardProps } from "./OrgBoard";

const BHeader = (props: IOrgBoardProps) => {
  const { isMobile, block, onClickDeleteBlock, onClickUpdateBlock } = props;

  return (
    <BoardBlockHeader
      {...props}
      onClickAddCollaborator={noop}
      onClickAddOrEditLabel={noop}
      onClickAddOrEditStatus={noop}
      onClickCreateNewBlock={noop}
      onClickDeleteBlock={() => onClickDeleteBlock(block)}
      onClickEditBlock={() => onClickUpdateBlock(block)}
      onNavigate={noop}
      style={{
        padding: "16px",
        boxSizing: "border-box",
        borderBottom: "1px solid #d9d9d9",
        width: isMobile ? "100%" : "320px",
      }}
    />
  );
};

export default React.memo(BHeader);
