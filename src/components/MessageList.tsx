import { css, cx } from "@emotion/css";
import { AlertProps } from "antd";
import { TextProps } from "antd/es/typography/Text";
import { isBoolean, isNumber, merge } from "lodash";
import isString from "lodash/isString";
import React from "react";
import { IAppError } from "../utils/errors";
import { appClassNames } from "./classNames";
import EmptyMessage from "./EmptyMessage";
import { AlertGroup } from "./utils/page/AlertGroup";
import { IStyleableComponent } from "./utils/styling/types";

export interface IMessageListProps extends IStyleableComponent {
  messages: string | IAppError | Array<string | IAppError> | null;
  shouldFillParent?: boolean;
  shouldPad?: boolean;
  type?: TextProps["type"];
  showMessageOnly?: boolean;
  useAlertGroup?: boolean;
  alertGroupCloseable?: boolean;
  useEmptyMessage?: boolean;
  maxWidth?: boolean | number;
}

const classes = {
  fillParent: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: "0 16px",
    height: "100%",
    margin: "auto",
  }),
};

const MessageList: React.FC<IMessageListProps> = (props) => {
  const {
    messages,
    shouldFillParent,
    type,
    shouldPad,
    className,
    style,
    alertGroupCloseable,
    maxWidth,
    useEmptyMessage,
  } = props;

  // TODO: should we show a generic error instead of []
  let errorList: IAppError[] = [];
  if (messages) {
    if (Array.isArray(messages)) {
      errorList = messages.map((error) => (isString(error) ? new Error(error) : error));
    } else if (isString(messages)) {
      errorList = [new Error(messages)];
    } else if ((messages as any).errors) {
      errorList = (messages as any).errors;
    } else if ((messages as Error).message) {
      errorList = [messages];
    }
  }

  let contentNode = (
    <AlertGroup
      type={textTypeToAlertType(type)}
      closable={alertGroupCloseable}
      messages={errorList}
    />
  );

  if (useEmptyMessage) {
    contentNode = <EmptyMessage>{contentNode}</EmptyMessage>;
  }

  // TODO: implement a better key for the items
  return (
    <div
      style={merge(
        { maxWidth: isNumber(maxWidth) ? maxWidth : isBoolean(maxWidth) ? "700px" : undefined },
        style
      )}
      className={cx(
        className,
        appClassNames.w100,
        shouldFillParent && classes.fillParent,
        shouldPad && appClassNames.p16
      )}
    >
      {contentNode}
    </div>
  );
};

function textTypeToAlertType(type: TextProps["type"]): AlertProps["type"] {
  switch (type) {
    case "danger":
      return "error";
    case "secondary":
      return "info";
    case "success":
      return "success";
    case "warning":
      return "warning";
    default:
      return "info";
  }
}

export default MessageList;
