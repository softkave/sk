import styled from "@emotion/styled";
import { Icon } from "antd";
import React from "react";
import StyledContainer from "./styled/Container";

export interface ITextProps {
  text: string;
  rows: number;
}

const Text: React.FC<ITextProps> = props => {
  const { text, rows } = props;
  const [expand, setExpand] = React.useState(false);
  const col = 32;
  const lastCol = 16;
  const cols = (rows - 1) * col + lastCol;
  const shouldShowControls = text.length > cols;

  const toggleExpand = () => setExpand(!expand);

  const renderControl = (controlText: string, icon: string) => (
    // @ts-ignore
    <StyledContainer
      // @ts-ignore
      as="button"
      s={{
        display: "inline-block",
        border: "none",
        backgroundColor: "inherit",
        color: "rgb(66,133,244)",
        cursor: "pointer"
      }}
      onClick={toggleExpand}
    >
      {controlText}
      <StyledControlIcon type={icon} />
    </StyledContainer>
  );

  if (shouldShowControls) {
    if (expand) {
      return (
        <StyledTextContainer>
          {text}
          {renderControl("less", "up")}
        </StyledTextContainer>
      );
    } else {
      const renderedText = text.slice(0, cols);

      return (
        <StyledHideTextContainer>
          {renderedText}
          {"... "}
          {renderControl("more", "down")}
        </StyledHideTextContainer>
      );
    }
  }

  return <StyledTextContainer>{text}</StyledTextContainer>;
};

export default Text;

const StyledTextContainer = styled.p({
  padding: 0,
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "normal",
  overflowWrap: "break-word",
  hyphens: "auto"
});

const StyledHideTextContainer = styled(StyledTextContainer)({
  whiteSpace: "normal"
});

const StyledControlIcon = styled(Icon)({
  fontSize: "11px"
});
