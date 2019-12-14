import { Icon } from "antd";
import React from "react";
import StyledContainer from "./styled/COntainer";

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
  const renderedText = shouldShowControls ? text.slice(0, cols) : text;

  const toggleExpand = () => setExpand(!expand);

  const renderControl = (controlText: string, icon: string) => (
    <StyledContainer
      // @ts-ignore
      as="button"
      s={{
        border: "none",
        backgroundColor: "inherit",
        color: "rgb(66,133,244)"
      }}
      onClick={toggleExpand}
    >
      {controlText}
      <Icon type={icon} style={{ paddingLeft: "4px" }} />
    </StyledContainer>
  );

  if (shouldShowControls) {
    if (expand) {
      return (
        <StyledContainer>
          {renderedText}
          {renderControl("less", "up")}
        </StyledContainer>
      );
    } else {
      return (
        <StyledContainer>
          {renderedText}
          {renderControl("more", "down")}
        </StyledContainer>
      );
    }
  }

  return <StyledContainer>{renderedText}</StyledContainer>;
};

export default Text;
