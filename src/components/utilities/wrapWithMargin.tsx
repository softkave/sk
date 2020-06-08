import React from "react";
import StyledContainer from "../styled/Container";

const wrapWithMargin = (
  content: React.ReactNode,
  marginLeft = 12,
  marginRight = 12,
  marginTop = 0,
  marginBottom = 0
) => {
  return (
    <StyledContainer s={{ marginLeft, marginRight, marginTop, marginBottom }}>
      {content}
    </StyledContainer>
  );
};

export default wrapWithMargin;
