import React from "react";
import { IBlock } from "../../models/block/block";
import BlockGrid from "../block/BlockGrid";
import BlockList from "../block/BlockList";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";

export interface IBoardListProps {
  boards: IBlock[];
  onClick?: (board: IBlock) => void;
}

const BoardList: React.FC<IBoardListProps> = (props) => {
  const { onClick, boards } = props;

  const renderBoards = () => (
    <RenderForDevice
      renderForMobile={() => (
        <BlockList
          blocks={boards}
          emptyDescription="Create a board to get started."
          onClick={onClick}
          showFields={["name", "description"]}
        />
      )}
      renderForDesktop={() => (
        <StyledContainer s={{ marginTop: "16px" }}>
          <BlockGrid
            blocks={boards}
            emptyDescription="Create an organization to get started."
            onClick={onClick}
            showFields={["name", "description"]}
            style={{ width: "100%" }}
          />
        </StyledContainer>
      )}
    />
  );

  // return renderBoards();

  return (
    <BlockList
      // padWidth
      border
      blocks={boards}
      onClick={onClick}
      showFields={["name"]}
      emptyDescription="No boards available."
    />
  );
};

export default BoardList;
