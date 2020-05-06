import { DownOutlined, UpOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import React from "react";
import StyledContainer from "./styled/Container";

const StyledButton = StyledContainer.withComponent("button");

export interface ITextProps {
  text: string;
  rows: number;
}

const Text: React.FC<ITextProps> = (props) => {
  const { text, rows } = props;
  const [expand, setExpand] = React.useState(false);
  const col = 36;
  const lastCol = 16;
  const cols = (rows - 1) * col + lastCol;
  const shouldShowControls = text.length > cols;

  const toggleExpand = () => setExpand(!expand);

  const renderControl = (controlText: string, icon: React.ReactNode) => (
    <StyledButton
      s={{
        display: "inline-block",
        border: "none",
        backgroundColor: "inherit",
        color: "rgb(66,133,244)",
        cursor: "pointer",
        padding: "0",
      }}
      onClick={toggleExpand}
    >
      {controlText}
      {icon}
    </StyledButton>
  );

  if (shouldShowControls) {
    if (expand) {
      return (
        <StyledTextContainer>
          {text}
          {renderControl("less", <UpOutlined style={{ fontSize: "10px" }} />)}
        </StyledTextContainer>
      );
    } else {
      const renderedText = text.slice(0, cols);

      return (
        <StyledHideTextContainer>
          {renderedText}
          {"..."}
          {renderControl("more", <DownOutlined style={{ fontSize: "10px" }} />)}
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
  hyphens: "auto",
});

const StyledHideTextContainer = styled(StyledTextContainer)({
  whiteSpace: "normal",
});
