import styled from "@emotion/styled";
import React from "react";

const ViewShell: React.SFC<{}> = props => {
  const { children } = props;

  return <StyledViewShell>{children}</StyledViewShell>;
};

export default ViewShell;

const StyledViewShell = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  color: "#999"
});
