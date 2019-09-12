import styled from "@emotion/styled";
import React from "react";

const Logo: React.SFC<any> = () => {
  return <StyledLogoWrapper>Softkave</StyledLogoWrapper>;
};

export default Logo;

const StyledLogoWrapper = styled.span(() => {
  return {
    backgroundColor: "#e7e7e7",
    borderRadius: "8px",
    padding: "8px",
    fontWeight: "bold"
  };
});
