import styled from "@emotion/styled";
import React from "react";

export interface ILoadingTextProps {
  percent: number;
}

const maxPercent = 100;

const LoadingText: React.SFC<ILoadingTextProps> = props => {
  const { percent, children } = props;
  // TODO: Clean unused comment codes
  // const progressFlex = Math.round(maxPercent / (maxPercent - percent));
  // const remainderFlex = Math.round(maxPercent / percent);

  return (
    <StyledLoadingTextContainer>
      <StyledLoadingText>{children}</StyledLoadingText>
      <StyledProgressContainer>
        <StyledProgress style={{ flex: percent }} />
        <StyledRemainder style={{ flex: maxPercent - percent }} />
      </StyledProgressContainer>
    </StyledLoadingTextContainer>
  );
};

export default LoadingText;

const StyledLoadingTextContainer = styled.div({
  position: "relative"
});

const StyledLoadingText = styled.div({
  zIndex: 99,
  opacity: 0,
  backgroundColor: "white"
});

const StyledProgressContainer = styled.div({
  position: "absolute",
  display: "flex"
});

const StyledProgress = styled.div({
  display: "flex",
  backgroundColor: "#555"
});

const StyledRemainder = styled.div({
  display: "flex",
  backgroundColor: "#ccc"
});
