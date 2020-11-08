import { LogoutOutlined, MessageOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";

export enum UserOptionsMenuKeys {
    Logout = "Logout",
    SendFeedback = "SendFeedback",
}

export interface IUserOptionsMenuProps {
    onSelect: (key: UserOptionsMenuKeys) => void;
}

const UserOptionsMenu: React.FC<IUserOptionsMenuProps> = (props) => {
    const { onSelect } = props;

    return (
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
    );
};

export default UserOptionsMenu;
