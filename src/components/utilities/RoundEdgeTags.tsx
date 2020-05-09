import React from "react";
import StyledContainer from "../styled/Container";

export interface IRoundEdgeTagsProps {
  color?: string;
  contentColor?: string;
}

const RoundEdgeTags: React.FC<IRoundEdgeTagsProps> = (props) => {
  const { color, children, contentColor } = props;

  return (
    <StyledContainer
      s={{
        padding: "1px 8px 0px 8px",
        borderRadius: "4em",
        backgroundColor: color || "#f0f0f0",
        fontSize: "13.33px",
        display: "inline-block",
        color: "white",
      }}
    >
      {children}
    </StyledContainer>
  );
};

export default RoundEdgeTags;
