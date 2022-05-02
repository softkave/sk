import {
  AppstoreOutlined,
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Badge, Menu, Space } from "antd";
import React from "react";
import { useUserUnseenRequestsCount } from "../request/useUserUnseenRequestsCount";

export enum UserOptionsMenuKeys {
  Logout = "Logout",
  SendFeedback = "Send Feedback",
  UserSettings = "Settings",
  Organizations = "Organizations",
  Requests = "Requests",
}

export interface IUserOptionsMenuProps {
  style?: React.CSSProperties;
  className?: string;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

interface IUserOptionsMenuItem {
  text: UserOptionsMenuKeys;
  icon: React.ReactNode;
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

const SPACE_SIZE = 27;
const items: IUserOptionsMenuItem[] = [
  { icon: <AppstoreOutlined />, text: UserOptionsMenuKeys.Organizations },
  { icon: <UserAddOutlined />, text: UserOptionsMenuKeys.Requests },
  { icon: <SettingOutlined />, text: UserOptionsMenuKeys.UserSettings },
  { icon: <MessageOutlined />, text: UserOptionsMenuKeys.SendFeedback },
  { icon: <LogoutOutlined />, text: UserOptionsMenuKeys.Logout },
];

const UserOptionsMenu: React.FC<IUserOptionsMenuProps> = (props) => {
  const { className, style, onSelect } = props;
  const unseenRequestsCount = useUserUnseenRequestsCount();
  return (
    <div className={cx(className, classes.root)} style={style}>
      <Menu
        onClick={(evt) => {
          onSelect(evt.key as UserOptionsMenuKeys);
        }}
        style={{ minWidth: "120px" }}
      >
        {items.map((item) => {
          const contentNode = (
            <Space align="center" size={SPACE_SIZE}>
              {item.icon}
              <span>{item.text}</span>
            </Space>
          );
          return (
            <Menu.Item key={item.text}>
              {item.text === UserOptionsMenuKeys.Requests &&
              unseenRequestsCount ? (
                <Badge count={unseenRequestsCount} color="blue">
                  {contentNode}
                </Badge>
              ) : (
                contentNode
              )}
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
};

export default UserOptionsMenu;
