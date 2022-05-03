import {
  CaretDownOutlined,
  CaretUpOutlined,
  MessageOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/css";
import { Space, Tag, Typography } from "antd";
import { noop } from "lodash";
import React from "react";
import { IUser } from "../../models/user/user";
import UserAvatar from "../collaborator/UserAvatar";
import { useUserUnseenChatsCount } from "../organization/useUserUnseenChatsCount";
import { useUserUnseenRequestsCount } from "../request/useUserUnseenRequestsCount";
import UserOptionsMenu, { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppSidebarDesktopMenuProps {
  user: IUser;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const kAntMenuItemSelector = "& .ant-menu-item";
const kAntMenuSelector = "& .ant-menu";
const classes = {
  root: css({
    display: "flex",
    padding: "8px 16px",
    cursor: "pointer",
    borderTop: "2px solid rgb(223, 234, 240)",
    flexDirection: "column",
    width: "100%",
  }),
  menu: css({
    marginBottom: "8px",

    [kAntMenuItemSelector]: {
      lineHeight: "24px",
      height: "auto",
      padding: "8px 0px",
      margin: 0,
      marginBottom: "0px !important",
    },

    "& .ant-menu-item:first-of-type": {
      paddingTop: 0,
    },

    [kAntMenuSelector]: {
      width: "100%",
    },
  }),
  tag: css({
    backgroundColor: "blue",
    fontSize: "13px",
    borderRadius: "11px",
    color: "white",
    border: "1px solid rgba(255, 77, 79, 0)",
  }),
  menuTriggerRoot: css({
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    columnGap: "16px",
  }),
};

const AppSidebarDesktopMenu: React.FC<IAppSidebarDesktopMenuProps> = (
  props
) => {
  const { user, onSelect } = props;
  const [showMenu, setShowMenu] = React.useState(false);
  const unseenRequestsCount = useUserUnseenRequestsCount();
  const unseenChatsCount = useUserUnseenChatsCount();
  const unseenRequestsCountNode = (
    <span>
      {unseenRequestsCount ? (
        <Tag icon={<UserAddOutlined />} color="blue">
          {unseenRequestsCount}
        </Tag>
      ) : null}
    </span>
  );
  const unseenChatsCountNode = (
    <span>
      {unseenChatsCount ? (
        <Tag icon={<MessageOutlined />} color="blue">
          {unseenChatsCount}
        </Tag>
      ) : null}
    </span>
  );
  return (
    <div className={classes.root} onClick={() => setShowMenu(!showMenu)}>
      {showMenu && (
        <UserOptionsMenu className={classes.menu} onSelect={onSelect} />
      )}
      <div className={classes.menuTriggerRoot}>
        <UserAvatar clickable user={user} onClick={noop} />
        <Typography.Text ellipsis>{user.name}</Typography.Text>
        <div>
          {unseenChatsCountNode}
          {unseenRequestsCountNode}
          <Typography.Text type="secondary">
            {showMenu ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default AppSidebarDesktopMenu;
