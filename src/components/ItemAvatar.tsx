import { css, cx } from "@emotion/css";
import { Avatar } from "antd";
import React from "react";

export interface IItemAvatarProps {
  color?: string;
  active?: boolean;
  clickable?: boolean;
  size?: number | "small" | "default" | "large";
  shape?: "square" | "circle";
  onClick?: () => void;
  children?: React.ReactNode;
}

const classes = {
  active: css({
    borderBottom: "2px solid rgb(66,133,244)",
    padding: "2px",
    borderRadius: "4px",
  }),
  clickable: css({
    cursor: "pointer",
    boxSizing: "border-box",
  }),
};

const ItemAvatar: React.FC<IItemAvatarProps> = (props) => {
  const { size, shape } = props;
  return (
    <div
      onClick={props.onClick}
      className={cx(
        css({
          display: "inline-flex",
          color: props.color,
        }),
        {
          [classes.active]: !!props.active,
          [classes.clickable]: !!props.onClick,
        }
      )}
    >
      <Avatar
        size={size}
        shape={shape}
        style={{
          backgroundColor: props.color,
          cursor: props.clickable && props.onClick ? "pointer" : undefined,
        }}
      >
        {props.children}
      </Avatar>
    </div>
  );
};

ItemAvatar.defaultProps = {
  color: "#999",
  size: "small",
  shape: "square",
};

export default ItemAvatar;
