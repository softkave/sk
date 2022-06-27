import {
  CaretDownOutlined,
  CaretUpOutlined,
  MessageOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/css";
import { Typography } from "antd";
import { noop } from "lodash";
import React from "react";
import { IUser } from "../../models/user/user";
import UserAvatar from "../collaborator/UserAvatar";
import { useUserUnseenChatsCount } from "../organization/useUserUnseenChatsCount";
import { useUserUnseenRequestsCount } from "../request/useUserUnseenRequestsCount";
import SkTag from "../utilities/SkTag";
import UserOptionsMenu, {
  UserOptionsMenuCountLabels,
  UserOptionsMenuKeys,
} from "./UserOptionsMenu";

export interface IAppSidebarDesktopMenuProps {
  user: IUser;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const classes = {
  root: css({
    display: "flex",
    cursor: "pointer",
    borderTop: "2px solid rgb(223, 234, 240)",
    flexDirection: "column",
    width: "100%",
  }),
  menu: css({
    "& .ant-menu-item": {
      lineHeight: "24px",
      padding: "8px 0px",
      margin: 0,
      marginBottom: "0px !important",
    },

    "& .ant-menu-item:first-of-type": {
      paddingTop: 0,
    },

    "& .ant-menu": {
      width: "100%",
    },
  }),
  SkTag: css({
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
    padding: "8px 16px",
  }),
};

const AppSidebarDesktopMenu: React.FC<IAppSidebarDesktopMenuProps> = (
  props
) => {
  const { user, onSelect } = props;
  const [showMenu, setShowMenu] = React.useState(false);
  const unseenRequestsCount = useUserUnseenRequestsCount();
  const unseenChatsCount = useUserUnseenChatsCount();
  // const unseenRequestsCount = 5;
  // const unseenChatsCount = 7;
  const menuCounts = React.useMemo(() => {
    return {
      [UserOptionsMenuCountLabels.UnseenRequestsCount]: unseenRequestsCount,
      [UserOptionsMenuCountLabels.UnseenChatsCount]: unseenChatsCount,
    };
  }, [unseenChatsCount, unseenRequestsCount]);

  const unseenRequestsCountNode = (
    <span>
      {unseenRequestsCount ? (
        <SkTag centerContent icon={<UserAddOutlined />} color="#096dd9">
          {unseenRequestsCount}
        </SkTag>
      ) : null}
    </span>
  );

  const unseenChatsCountNode = (
    <span>
      {unseenChatsCount ? (
        <SkTag centerContent icon={<MessageOutlined />} color="#096dd9">
          {unseenChatsCount}
        </SkTag>
      ) : null}
    </span>
  );

  return (
    <div className={classes.root} onClick={() => setShowMenu(!showMenu)}>
      {showMenu && (
        <UserOptionsMenu
          className={classes.menu}
          onSelect={onSelect}
          counts={menuCounts}
        />
      )}
      <div className={classes.menuTriggerRoot}>
        <UserAvatar clickable user={user} onClick={noop} />
        <Typography.Text strong ellipsis>
          {user.name}
        </Typography.Text>
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
