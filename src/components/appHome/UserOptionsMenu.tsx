import { LogoutOutlined, MessageOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";
import { ComponentStyle } from "../types";

export enum UserOptionsMenuKeys {
    Logout = "Logout",
    SendFeedback = "SendFeedback",
}

export interface IUserOptionsMenuProps {
    style?: ComponentStyle;
    className?: string;
    onSelect: (key: UserOptionsMenuKeys) => void;
}

const kAntMenuSelector = "& .ant-menu";

const UserOptionsMenu: React.FC<IUserOptionsMenuProps> = (props) => {
    const { className, onSelect } = props;

    const style = props.style || {};
    const propStyleAntMenuStyle = style[kAntMenuSelector] || {};
    const antMenuStyle = {
        borderRight: "none",
        ...propStyleAntMenuStyle,
    };

    style[kAntMenuSelector] = antMenuStyle;

    return (
        <StyledContainer className={className} s={style}>
            <Menu
                onClick={(evt) => {
                    onSelect(evt.key as UserOptionsMenuKeys);
                }}
                style={{ minWidth: "120px" }}
            >
                <Menu.Item key={UserOptionsMenuKeys.SendFeedback}>
                    <MessageOutlined />
                    Send Feedback
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    key={UserOptionsMenuKeys.Logout}
                    style={{ color: "rgb(255, 77, 79)" }}
                >
                    <LogoutOutlined />
                    Logout
                </Menu.Item>
            </Menu>
        </StyledContainer>
    );
};

export default UserOptionsMenu;