import React from "react";
import StyledContainer from "../styled/Container";

const LoadingEllipsis: React.FC<{}> = () => (
  <StyledContainer
    s={{
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "32px"
    }}
  >
    ...
  </StyledContainer>
);

export default LoadingEllipsis;
