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

interface IStyledMessageProps {
  type?: string;
}

const StyledFormMessage = styled.div<IStyledMessageProps>(props => ({
  color: getFontColor(props.type),
  lineHeight: "24px",
  padding: "8px 0"
}));

export interface IFormMessageProps {
  message?: string | string[];
  type?: "error" | "message";
}

const FormMessage: React.SFC<IFormMessageProps> = props => {
  const { children, message, type } = props;
  const messages = Array.isArray(message) ? message : [message];
  const isVisible =
    React.Children.count(children) > 0 ||
    (Array.isArray(message) ? message.length > 0 : !!message);

  if (!isVisible) {
    return null;
  }

  return (
    <StyledFormMessage type={type}>
      {children}
      {messages.map(nextMessage => nextMessage)}
    </StyledFormMessage>
  );
};

FormMessage.defaultProps = {
  message: []
};

export default FormMessage;
