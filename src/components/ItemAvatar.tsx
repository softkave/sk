import styled from "@emotion/styled";
import { Avatar } from "antd";
import React from "react";

export interface IItemAvatarProps {
  color?: string;
  onClick?: () => void;
  active?: boolean;
  clickable?: boolean;
}

const ItemAvatar: React.SFC<IItemAvatarProps> = props => {
  return (
    <StyledAvatarContainer
      active={props.active}
      onClick={props.onClick}
      color={props.color!}
      type={props.clickable && props.onClick ? "thumbnail" : "regular"}
    >
      <Avatar
        size="default"
        shape="square"
        style={{
          backgroundColor: props.color,
          cursor: props.clickable && props.onClick ? "pointer" : undefined
        }}
      >
        {props.children}
      </Avatar>
    </StyledAvatarContainer>
  );
};

ItemAvatar.defaultProps = {
  color: "#999"
};

interface IAvatarContainerProps {
  active?: boolean;
  color: string;
  type: "regular" | "thumbnail";
}

const StyledAvatarContainer = styled("span")<IAvatarContainerProps>(props => {
  const styles: React.CSSProperties = {
    display: "inline-block",
    color: props.color
  };

  switch (props.type) {
    case "thumbnail": {
      return {
        ...styles,
        border: props.active
          ? "2px solid rgb(66,133,244)"
          : "2px solid rgba(255,255,255,1)",
        padding: props.active ? "2px" : undefined,
        borderRadius: props.active ? "4px" : undefined,
        cursor: "pointer",
        boxSizing: "border-box"
      };
    }

    case "regular":
    default: {
      return {
        ...styles
      };
    }
  }
});

export default ItemAvatar;
