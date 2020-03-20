import React from "react";
import StyledContainer from "../styled/Container";

const wrapWithMargin = (
  content: React.ReactNode,
  marginLeft = 8,
  marginRight = 8
) => {
  return (
    <StyledContainer s={{ marginLeft, marginRight }}>{content}</StyledContainer>
  );
};

export default wrapWithMargin;
