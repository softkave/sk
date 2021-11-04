import {
    LogoutOutlined,
    MessageOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Menu, Space } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";
import { ComponentStyle } from "../types";

export enum UserOptionsMenuKeys {
    Logout = "Logout",
    SendFeedback = "SendFeedback",
    UserSettings = "UserSettings",
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
                <Menu.Item key={UserOptionsMenuKeys.UserSettings}>
                    <Space align="center" size={27}>
                        <SettingOutlined />
                        Settings
                    </Space>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key={UserOptionsMenuKeys.SendFeedback}>
                    <Space align="center" size={27}>
                        <MessageOutlined />
                        Send Feedback
                    </Space>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    key={UserOptionsMenuKeys.Logout}
                    style={{ color: "rgb(255, 77, 79)" }}
                >
                    <Space align="center" size={27}>
                        <LogoutOutlined />
                        Logout
                    </Space>
                </Menu.Item>
            </Menu>
        </StyledContainer>
    );
};

export default UserOptionsMenu;
