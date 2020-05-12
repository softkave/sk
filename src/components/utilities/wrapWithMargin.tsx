import React from "react";
import StyledContainer from "../styled/Container";

const wrapWithMargin = (
  content: React.ReactNode,
  marginLeft = 12,
  marginRight = 12
) => {
  return (
    <StyledContainer s={{ marginLeft, marginRight }}>{content}</StyledContainer>
  );
};

export default wrapWithMargin;
