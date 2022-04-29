import { css } from "@emotion/css";
import { Typography } from "antd";
import isString from "lodash/isString";
import React from "react";
import { IAppError } from "../net/types";
import EmptyMessage, { IEmptyMessageProps } from "./EmptyMessage";

export interface IMessageProps extends IEmptyMessageProps {
  message: Error | Pick<IAppError, "message"> | string;
  listIndex?: number; // For error list, to show empty icon ony once
}

const classes = {
  message: css({
    fontSize: "16px",
    display: "inline-block",
    marginTop: "12px",
  }),
};

const PageError: React.FC<IMessageProps> = (props) => {
  const { message, children, listIndex } = props;
  let messageContentNode: React.ReactNode = children || "An error occurred.";

  if (isString(message)) {
    messageContentNode = message;
  } else if (message?.message) {
    messageContentNode = message.message;
  }

  const messageNode = (
    <Typography.Text className={classes.message} type="secondary">
      {messageContentNode}
    </Typography.Text>
  );

  if (listIndex && listIndex > 0) {
    return messageNode;
  }

  return <EmptyMessage {...props}>{messageNode}</EmptyMessage>;
};

export default PageError;
