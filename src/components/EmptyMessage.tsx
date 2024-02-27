import { css, cx } from "@emotion/css";
import { Empty } from "antd";
import React from "react";
import { appClassNames } from "./classNames";

export interface IEmptyMessageProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  shouldPad?: boolean;
}

const classes = {
  root: css({
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  }),
};

const EmptyMessage: React.FC<IEmptyMessageProps> = (props) => {
  const { children, className, style, shouldPad } = props;
  return (
    <div className={cx(className, classes.root, shouldPad && appClassNames.p16)} style={style}>
      <Empty description={children} className={appClassNames.w100} />
    </div>
  );
};

export default EmptyMessage;
