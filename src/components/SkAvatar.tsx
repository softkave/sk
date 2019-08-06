import styled from "@emotion/styled";
import { Avatar } from "antd";
import React from "react";

export interface IAvatarProps {
  color?: string;
  onClick?: () => void;
  active?: boolean;
  clickable?: boolean;
}

const SkAvatar: React.SFC<IAvatarProps> = props => {
  return (
    <AvatarContainer
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
    </AvatarContainer>
  );
};

SkAvatar.defaultProps = {
  color: "#aaa"
};

interface IAvatarContainerProps {
  active?: boolean;
  color: string;
  type: "regular" | "thumbnail";
}

const AvatarContainer = styled("span")<IAvatarContainerProps>(props => {
  switch (props.type) {
    case "thumbnail": {
      return {
        color: props.color,
        border: props.active ? "2px solid rbg(66,133,244)" : undefined,
        cursor: "pointer"
      };
    }

    case "regular":
    default: {
      return {
        color: props.color
      };
    }
  }
});

export default SkAvatar;
