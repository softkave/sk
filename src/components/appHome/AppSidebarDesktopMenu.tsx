import {
  CaretDownOutlined,
  CaretUpOutlined,
  MessageOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/css";
import { Space, Typography } from "antd";
import { noop } from "lodash";
import React from "react";
import { isAnonymousUserId, isDemoUserId } from "../../models/app/utils";
import { IUser } from "../../models/user/types";
import { getUserFullName } from "../../models/user/utils";
import { appStyles } from "../classNames";
import { useUserUnseenChatsCount } from "../organization/useUserUnseenChatsCount";
import { useUserUnseenRequestsCount } from "../request/useUserUnseenRequestsCount";
import NamedAvatar from "../utils/NamedAvatar";
import SkTag from "../utils/SkTag";
import IconButton from "../utils/buttons/IconButton";
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
  skTag: css({
    backgroundColor: "blue",
    fontSize: "13px",
    borderRadius: "11px",
    color: "white",
    border: "1px solid rgba(255, 77, 79, 0)",
  }),
  userInfo: css({
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    columnGap: "16px",
  }),
  menuTriggerRoot: css({
    padding: "16px",
  }),
};

const AppSidebarDesktopMenu: React.FC<IAppSidebarDesktopMenuProps> = (props) => {
  const { user, onSelect } = props;
  const [showMenu, setShowMenu] = React.useState(false);
  const unseenRequestsCount = useUserUnseenRequestsCount();
  const unseenChatsCount = useUserUnseenChatsCount();
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

  const userName = getUserFullName(user);
  const menuTriggerNode = (
    <Space
      direction="vertical"
      size={"middle"}
      style={appStyles.p100}
      className={classes.menuTriggerRoot}
    >
      {isDemoUserId(user.customId) ? (
        <Typography.Text type="secondary">
          Reloading the page will reset the session and you'll lose your activity if you're not done
          demoing the product.
        </Typography.Text>
      ) : isAnonymousUserId(user.customId) ? (
        <Typography.Text type="secondary">
          Remember to <Typography.Text strong>logout</Typography.Text> when done if this device does
          not belong to you. Not doing so would mean your chats will be visible to anybody using
          this browser to access Boards as an anonymous user if you have chats.
        </Typography.Text>
      ) : null}
      <div className={classes.userInfo}>
        <NamedAvatar clickable item={{ ...user, name: userName }} onClick={noop} />
        <Typography.Text strong ellipsis>
          {userName}
        </Typography.Text>
        <div>
          {unseenChatsCountNode}
          {unseenRequestsCountNode}
          <IconButton icon={showMenu ? <CaretUpOutlined /> : <CaretDownOutlined />} />
        </div>
      </div>
    </Space>
  );

  return (
    <div className={classes.root} onClick={() => setShowMenu(!showMenu)}>
      {showMenu && <UserOptionsMenu onSelect={onSelect} counts={menuCounts} />}
      {menuTriggerNode}
    </div>
  );
};

export default AppSidebarDesktopMenu;
