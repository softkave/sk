import {
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Menu, Space } from "antd";
import React from "react";

export enum UserOptionsMenuKeys {
  Logout = "Logout",
  SendFeedback = "SendFeedback",
  UserSettings = "UserSettings",
}

export interface IUserOptionsMenuProps {
  style?: React.CSSProperties;
  className?: string;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const classes = {
  root: css({
    "& .ant-menu-vertical": {
      border: "none",
    },

    "& .ant-menu-item": {
      padding: "0px !important",
    },
  }),
};

const UserOptionsMenu: React.FC<IUserOptionsMenuProps> = (props) => {
  const { className, style, onSelect } = props;

  return (
    <div className={cx(className, classes.root)} style={style}>
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
        <Menu.Divider key="divider" />
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
    </div>
  );
};

export default UserOptionsMenu;
