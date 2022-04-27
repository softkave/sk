import { css, cx } from "@emotion/css";
import { Empty } from "antd";
import React from "react";

export interface IEmptyMessageProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const EmptyMessage: React.FC<IEmptyMessageProps> = (props) => {
  const { children, className, style } = props;
  return (
    <div
      className={cx(
        className,
        css({
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        })
      )}
      style={style}
    >
      <Empty description={children} />
    </div>
  );
};

export default EmptyMessage;
