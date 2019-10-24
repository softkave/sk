import styled from "@emotion/styled";
import React from "react";
import BoardShell, { IBoardShellProps } from "./BoardShell";

const BoardError: React.SFC<IBoardShellProps> = props => {
  return (
    <BoardShell {...props}>
      <StyledError>Error loading data</StyledError>
    </BoardShell>
  );
};

export default BoardError;

const StyledError = styled.p({
  fontSize: "18px",
  color: "red"
});
