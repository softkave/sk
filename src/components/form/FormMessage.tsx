import styled from "@emotion/styled";
import React from "react";
import { INetError } from "../../net/types";

export interface IFormMessageProps {
  message?: string | string[] | Error | Error[] | INetError | INetError[];
  type?: "error" | "message";
}

const FormMessage: React.SFC<IFormMessageProps> = (props) => {
  const { children, message, type } = props;
  const messages = Array.isArray(message) ? message : message ? [message] : [];
  const isVisible = React.Children.count(children) > 0 || messages.length > 0;

  const renderMessage = (msg) => {
    if (msg) {
      if (typeof msg === "string") {
        return msg;
      } else if (msg.message) {
        return msg.message;
      }
    }

    return null;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <StyledFormMessage type={type}>
      {children}
      {messages.length === 1 && renderMessage(messages[0])}
      {messages.length > 1 && (
        <ul>
          {messages.map((nextMessage) => {
            return <li>{renderMessage(nextMessage)}</li>;
          })}
        </ul>
      )}
    </StyledFormMessage>
  );
};

FormMessage.defaultProps = {
  message: [],
};

export default FormMessage;

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

const StyledFormMessage = styled.div<IStyledMessageProps>((props) => ({
  color: getFontColor(props.type),
  lineHeight: "24px",
  padding: "4px 0",
}));
