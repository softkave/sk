import styled from "@emotion/styled";
import React from "react";

import { IBlock } from "../../models/block/block";

export interface IBoardShellProps {
  block: IBlock;
}

const BoardShell: React.SFC<IBoardShellProps> = props => {
  const { children, block } = props;

  return (
    <StyledBoardShell>
      <StyledBoardName>{block.name}</StyledBoardName>
      <StyledContent>{children}</StyledContent>
    </StyledBoardShell>
  );
};

export default BoardShell;

const StyledBoardShell = styled.div({
  padding: "32px"
});

const StyledBoardName = styled.div({});

const StyledContent = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1
});
