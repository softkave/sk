import styled from "@emotion/styled";
import React from "react";

function getFontColor(type) {
  switch (type) {
    case "error":
      return "red";

    case "message":
      return "green";

    default:
      return "black";
  }
}

const StyledFormMessage = styled.div(props => ({
  color: getFontColor(props.type),
  lineHeight: "24px",
  padding: "8px 0"
}));

export default function FormMessage(props) {
  const { children, message, type } = props;

  return (
    <StyledFormMessage type={type}>
      {children}
      {[].concat(message).map(nextMessage => nextMessage)}
    </StyledFormMessage>
  );
}

FormMessage.defaultProps = {
  message: []
};
