import React from "react";
import StyledContainer from "../components/styled/Container";

export interface IWebCardProps {
  icon: React.ReactNode;
  text: string;
}

const WebCard: React.FC<IWebCardProps> = props => {
  const { icon, text } = props;

  return (
    <StyledContainer
      s={{
        flexDirection: "column",
        justifyContent: "center",
        margin: "16px",
        maxWidth: "100px",
        textAlign: "center"
        // ["&:first-of-type"]: { marginLeft: 0 },
        // ["&:last-of-type"]: { marginRight: 0 }
      }}
    >
      <StyledContainer
        s={{
          flexDirection: "column",
          justifyContent: "center",
          fontSize: "32px",
          marginBottom: "18px"
        }}
      >
        {icon}
      </StyledContainer>
      {text}
    </StyledContainer>
  );
};

export default WebCard;
