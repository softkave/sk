import React from "react";
import StyledContainer from "../components/styled/Container";

export interface IWebCardProps {
  icon: React.ReactNode;
  text: string;
}

const WebCard: React.FC<IWebCardProps> = props => {
  const { icon, text } = props;

  return (
    <StyledContainer s={{ flexDirection: "column", justifyContent: "center" }}>
      {icon}
      {text}
    </StyledContainer>
  );
};

export default WebCard;
