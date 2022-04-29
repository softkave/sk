import { css } from "@emotion/css";
import { Divider } from "antd";
import isString from "lodash/isString";
import React from "react";
import { IAppError } from "../net/types";
import Message from "./Message";

export interface IMessageListProps {
  messages: string | IAppError | Array<string | IAppError>;
  fill?: boolean;
}

const classes = {
  root: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    maxWidth: "400px",
    width: "100%",
    padding: "0 16px",
    height: "100%",
  }),
};

const MessageList: React.FC<IMessageListProps> = (props) => {
  const { messages, fill } = props;

  // TODO: should we show a generic error instead of []
  let errorList: IAppError[] = [];

  if (messages) {
    if (Array.isArray(messages)) {
      errorList = messages.map((error) =>
        isString(error) ? new Error(error) : error
      );
    } else if (isString(messages)) {
      errorList = [new Error(messages)];
    } else if ((messages as any).errors) {
      errorList = (messages as any).errors;
    } else if ((messages as Error).message) {
      errorList = [messages];
    }
  }

  // TODO: implement a better key for the items
  const content = (
    <div style={{}}>
      {errorList.map((error, index) => (
        <React.Fragment key={error.name ? `${error.name}-${index}` : index}>
          <Message message={error} listIndex={index} />
          {index !== errorList.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  );

  if (fill) {
    return <div className={classes.root}>{content}</div>;
  }

  return content;
};

export default MessageList;
