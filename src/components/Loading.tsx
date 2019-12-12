import styled from "@emotion/styled";
import React from "react";

export interface ILoadingProps {
  fontSize?: string | number;
}

const Loading: React.FC<ILoadingProps> = props => {
  return <StyledContainer>Loading</StyledContainer>;
};

Loading.defaultProps = {
  fontSize: "50px"
};

export default Loading;

const StyledContainer = styled.div({
  display: "flex",
  flex: 1,
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center"
});
