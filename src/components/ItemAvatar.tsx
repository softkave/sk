import styled from "@emotion/styled";
import { Avatar } from "antd";
import React from "react";

export interface IItemAvatarProps {
    color?: string;
    active?: boolean;
    clickable?: boolean;
    size?: number | "small" | "default" | "large";
    shape?: "square" | "circle";
    onClick?: () => void;
}

const ItemAvatar: React.FC<IItemAvatarProps> = (props) => {
    const { size, shape } = props;

    return (
        <StyledAvatarContainer
            active={props.active}
            onClick={props.onClick}
            color={props.color!}
            type={props.clickable && props.onClick ? "thumbnail" : "regular"}
        >
            <Avatar
                size={size}
                shape={shape}
                style={{
                    backgroundColor: props.color,
                    cursor:
                        props.clickable && props.onClick
                            ? "pointer"
                            : undefined,
                }}
            >
                {props.children}
            </Avatar>
        </StyledAvatarContainer>
    );
};

ItemAvatar.defaultProps = {
    color: "#999",
    size: "small",
    shape: "square",
};

interface IAvatarContainerProps {
    active?: boolean;
    color: string;
    type: "regular" | "thumbnail";
}

const StyledAvatarContainer = styled("span")<IAvatarContainerProps>((props) => {
    const styles: React.CSSProperties = {
        display: "inline-block",
        color: props.color,
    };

    switch (props.type) {
        case "thumbnail": {
            return {
                ...styles,
                borderBottom: props.active
                    ? "2px solid rgb(66,133,244)"
                    : "none",
                padding: props.active ? "2px" : undefined,
                borderRadius: props.active ? "4px" : undefined,
                cursor: "pointer",
                boxSizing: "border-box",
            };
        }

        case "regular":
        default: {
            return {
                ...styles,
            };
        }
    }
});

export default ItemAvatar;
