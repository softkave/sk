import React from "react";
import StyledContainer from "../styled/Container";

export interface IRoundEdgeTagsProps {
  color?: string;
}

const RoundEdgeTags: React.FC<IRoundEdgeTagsProps> = (props) => {
  const { color, children } = props;

  return (
    <StyledContainer
      s={{
        padding: "1px 8px 0px 8px",
        borderRadius: "4em",
        color: "#f0f0f0" || color,
        fontSize: "13.33px",
        display: "inline-block",
      }}
    >
      {children}
    </StyledContainer>
  );
};

export default RoundEdgeTags;
