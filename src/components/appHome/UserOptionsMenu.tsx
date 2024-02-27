import { css, cx } from "@emotion/css";
import { Badge, Menu } from "antd";
import { defaultTo } from "lodash";
import React from "react";
import { FiGrid, FiLogOut, FiMessageSquare, FiSettings, FiUsers } from "react-icons/fi";
import { useRouteMatch } from "react-router";
import { appLoggedInPaths, appRoutes } from "../../models/app/routes";
import CustomIcon from "../utils/buttons/CustomIcon";
import { cssProperties } from "../utils/fns";
import { AntDMenuItemType } from "../utils/types";

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
      lineHeight: "24px",
      padding: "8px 16px",
      margin: "0px !important",
      width: "100%",
      borderRadius: "0px !important",
    },
    "& .ant-menu-item-divider": {
      margin: "0px !important",
      border: "none",
      borderTop: "1px solid rgb(223, 234, 240)",
    },
    "& .ant-menu": {
      width: "100%",
      borderInlineEnd: "none !important",
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
      justifyContent: "center",
    },
  }),
};

const styles = {
  menuItem: cssProperties({
    display: "flex",
    height: "34px",
    lineHeight: "34px",
    alignItems: "center",
  }),
};

let dividerCount = 1;
const nextDividerId = () => `divider-${dividerCount++}`;
const items: IUserOptionsMenuItem[] = [
  {
    icon: <CustomIcon icon={<FiGrid />} />,
    label: UserOptionsMenuKeys.Organizations,
    key: UserOptionsMenuKeys.Organizations,
    style: styles.menuItem,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
  {
    icon: <CustomIcon icon={<FiUsers />} />,
    label: UserOptionsMenuKeys.Requests,
    countKey: UserOptionsMenuCountLabels.UnseenRequestsCount,
    key: UserOptionsMenuKeys.Requests,
    style: styles.menuItem,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
  {
    icon: <CustomIcon icon={<FiSettings />} />,
    label: UserOptionsMenuKeys.UserSettings,
    key: UserOptionsMenuKeys.UserSettings,
    style: styles.menuItem,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
  {
    icon: <CustomIcon icon={<FiMessageSquare />} />,
    label: UserOptionsMenuKeys.SendFeedback,
    key: UserOptionsMenuKeys.SendFeedback,
    style: styles.menuItem,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
  {
    danger: true,
    icon: <CustomIcon icon={<FiLogOut />} />,
    label: UserOptionsMenuKeys.Logout,
    key: UserOptionsMenuKeys.Logout,
    style: styles.menuItem,
    className: classes.menuItem,
  },
  { type: "divider", key: nextDividerId() },
];

const UserOptionsMenu: React.FC<IUserOptionsMenuProps> = (props) => {
  const { className, style, counts, onSelect } = props;
  const menuCounts = defaultTo(counts, {});
  const routeMatch = useRouteMatch<{ route: string }>(`${appRoutes.app}/:route`);
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
            {count ? <Badge count={count} style={{ backgroundColor: "#1890ff" }} /> : null}
          </span>
        </div>
      );

      return {
        ...item,
        label: contentNode,
      };
    });
  }, [menuCounts]);

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
