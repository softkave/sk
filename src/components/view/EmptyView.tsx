import styled from "@emotion/styled";
import React from "react";

const EmptyView: React.SFC<{}> = () => {
  return (
    <StyledEmptyView>This is not the view you are looking for.</StyledEmptyView>
  );
};

export default EmptyView;

const StyledEmptyView = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  color: "#999"
});
