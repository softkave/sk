import styled from "@emotion/styled";

const StyledHorizontalScrollContainer = styled.div({
  width: "100%",
  height: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  flex: 1,
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  boxSizing: "border-box"
});

export default StyledHorizontalScrollContainer;
