import {
  AppstoreOutlined,
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Badge, Menu } from "antd";
import React from "react";
import { useRouteMatch } from "react-router";
import { appLoggedInPaths, appRoutes } from "../../models/app/routes";
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
      padding: "0px 16px !important",
      margin: "0px !important",
    },
  }),
  menuItem: css({
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    columnGap: 16,
  }),
  menuItemIcon: css({
    width: "24px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  }),
};

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
  const routeMatch = useRouteMatch<{ route: string }>(
    `${appRoutes.app}/:route`
  );
  const selectedKey = React.useMemo(() => {
    if (routeMatch) {
      console.log(routeMatch);
      switch (routeMatch.url) {
        case appLoggedInPaths.organizations:
          return UserOptionsMenuKeys.Organizations;
        case appLoggedInPaths.requests:
          return UserOptionsMenuKeys.Requests;
        case appLoggedInPaths.settings:
          return UserOptionsMenuKeys.UserSettings;
      }
    }
    return UserOptionsMenuKeys.Organizations;
  }, [routeMatch]);
  return (
    <div className={cx(className, classes.root)} style={style}>
      <Menu
        onClick={(evt) => {
          onSelect(evt.key as UserOptionsMenuKeys);
        }}
        style={{ minWidth: "120px" }}
        selectedKeys={[selectedKey]}
      >
        {items.map((item) => {
          const contentNode = (
            <div className={classes.menuItem}>
              <span className={classes.menuItemIcon}>{item.icon}</span>
              <span>{item.text}</span>
              <span>
                {item.text === UserOptionsMenuKeys.Requests &&
                unseenRequestsCount ? (
                  <Badge
                    count={unseenRequestsCount}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                ) : null}
              </span>
            </div>
          );
          return (
            <React.Fragment key={item.text}>
              <Menu.Item key={item.text}>{contentNode}</Menu.Item>
              <Menu.Divider key={`${item.text}-divider`} />
            </React.Fragment>
          );
        })}
      </Menu>
    </div>
  );
};

export default UserOptionsMenu;
