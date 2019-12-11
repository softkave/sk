import styled from "@emotion/styled";
import React from "react";
import OperationError from "../../utils/operation-error/OperationError";

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
  message?: string | string[] | Error | Error[];
  type?: "error" | "message";
}

const FormMessage: React.FC<IFormMessageProps> = props => {
  const { children, message, type } = props;
  // const messages = Array.isArray(message) ? message : message ? [message] : [];
  const messages = Array.isArray(message)
    ? message
    : OperationError.isOperationError(message)
    ? message.errors
    : message
    ? [message]
    : [];
  const isVisible = React.Children.count(children) > 0 || messages.length > 0;

  if (!isVisible) {
    return null;
  }

  return (
    <StyledFormMessage type={type}>
      {children}
      {messages.map(nextMessage => {
        if (nextMessage) {
          if (typeof nextMessage === "string") {
            return nextMessage;
          } else {
            return nextMessage.message;
          }
        }

        return null;
      })}
    </StyledFormMessage>
  );
};

FormMessage.defaultProps = {
  message: []
};

export default FormMessage;
