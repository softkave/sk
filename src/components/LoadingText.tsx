import styled from "@emotion/styled";
import React from "react";

export interface ILoadingTextProps {
  percent: number;
}

const minPercent = 0;
const maxPercent = 100;

const LoadingText: React.SFC<ILoadingTextProps> = props => {
  const { percent, children } = props;
  const progressFlex = Math.round(maxPercent / (maxPercent - percent));
  const remainderFlex = Math.round(maxPercent / percent);

  return (
    <StyledLoadingTextContainer>
      <StyledLoadingText>{children}</StyledLoadingText>
      <StyledProgressContainer>
        <StyledProgress style={{ flex: progressFlex }} />
        <StyledRemainder style={{ flex: remainderFlex }} />
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
