import {
  AppstoreOutlined,
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Badge, Menu } from "antd";
import { defaultTo } from "lodash";
import React from "react";
import { useRouteMatch } from "react-router";
import { appLoggedInPaths, appRoutes } from "../../models/app/routes";
import { AntDMenuItemType } from "../utilities/types";

export enum UserOptionsMenuKeys {
  Logout = "Logout",
  SendFeedback = "Send Feedback",
  UserSettings = "Settings",
  Organizations = "Organizations",
  Requests = "Requests",
}

export enum UserOptionsMenuCountLabels {
  UnseenRequestsCount = "UnseenRequestsCount",
  UnseenChatsCount = "UnseenChatsCount",
}

export interface IUserOptionsMenuProps {
  style?: React.CSSProperties;
  className?: string;
  counts?: Partial<Record<UserOptionsMenuCountLabels, number>>;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

type IUserOptionsMenuItem = Partial<AntDMenuItemType> & {
  icon?: React.ReactNode;
  countKey?: UserOptionsMenuCountLabels;
  label?: UserOptionsMenuKeys;
  key: string;
};

const classes = {
  root: css({
    "& .ant-menu-vertical": {
      border: "none",
    },

    "& .ant-menu-item": {
      padding: "0px 16px !important",
      margin: "0px !important",
    },

    "& .ant-menu-item-divider": {
      margin: "0px !important",
    },
  }),
  menuItemContent: css({
    display: "grid",
    gridTemplateColumns: "1fr auto",
    columnGap: 16,
  }),
  menuItem: css({
    "& .ant-menu-title-content": {
      flex: 1,
      marginLeft: "16px !important",
    },

    "& .ant-menu-item-icon": {
      width: "24px",
    },
  }),
};

const menuStyle: React.CSSProperties = {
  display: "flex",
  height: "34px",
  lineHeight: "34px",
  alignItems: "center",
};

let dividerCount = 1;
const nextDividerId = () => `divider-${dividerCount++}`;
const items: IUserOptionsMenuItem[] = [
  {
    icon: <AppstoreOutlined />,
    label: UserOptionsMenuKeys.Organizations,
    key: UserOptionsMenuKeys.Organizations,
    style: menuStyle,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
  {
    icon: <UserAddOutlined />,
    label: UserOptionsMenuKeys.Requests,
    countKey: UserOptionsMenuCountLabels.UnseenRequestsCount,
    key: UserOptionsMenuKeys.Requests,
    style: menuStyle,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
  {
    icon: <SettingOutlined />,
    label: UserOptionsMenuKeys.UserSettings,
    key: UserOptionsMenuKeys.UserSettings,
    style: menuStyle,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
  {
    icon: <MessageOutlined />,
    label: UserOptionsMenuKeys.SendFeedback,
    key: UserOptionsMenuKeys.SendFeedback,
    style: menuStyle,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
  {
    danger: true,
    icon: <LogoutOutlined />,
    label: UserOptionsMenuKeys.Logout,
    key: UserOptionsMenuKeys.Logout,
    style: menuStyle,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
];

const UserOptionsMenu: React.FC<IUserOptionsMenuProps> = (props) => {
  const { className, style, counts, onSelect } = props;
  const menuCounts = defaultTo(counts, {});
  const routeMatch = useRouteMatch<{ route: string }>(
    `${appRoutes.app}/:route`
  );

  const selectedKey = React.useMemo(() => {
    if (routeMatch) {
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

  const menuItems = React.useMemo(() => {
    return items.map((item) => {
      const count = item.countKey && menuCounts[item.countKey];
      const contentNode = (
        <div className={classes.menuItemContent}>
          <span>{item.label}</span>
          <span>
            {count ? (
              <Badge count={count} style={{ backgroundColor: "#1890ff" }} />
            ) : null}
          </span>
        </div>
      );

      return {
        ...item,
        label: contentNode,
      };
    });
  }, [counts, menuCounts]);

  return (
    <div className={cx(className, classes.root)} style={style}>
      <Menu
        onClick={(evt) => {
          onSelect(evt.key as UserOptionsMenuKeys);
        }}
        style={{ minWidth: "120px" }}
        selectedKeys={[selectedKey]}
        items={menuItems}
      />
    </div>
  );
};

export default UserOptionsMenu;
