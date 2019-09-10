import styled from "@emotion/styled";
import React from "react";

const Logo: React.SFC<void> = () => {
  return <StyledLogo>Softkave</StyledLogo>;
};

export default Logo;

const StyledLogo = styled.span({
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: "#fafafa"
});
