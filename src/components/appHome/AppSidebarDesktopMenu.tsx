import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Typography } from "antd";
import { noop } from "lodash";
import React from "react";
import { IUser } from "../../models/user/user";
import UserAvatar from "../collaborator/UserAvatar";
import SpaceOut, { ISpaceOutContent } from "../utilities/SpaceOut";
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
};

const AppSidebarDesktopMenu: React.FC<IAppSidebarDesktopMenuProps> = (
  props
) => {
  const { user, onSelect } = props;
  const [showMenu, setShowMenu] = React.useState(false);
  const spaceOutContent: ISpaceOutContent[] = React.useMemo(() => {
    const content: ISpaceOutContent[] = [
      {
        node: <UserAvatar clickable user={user} onClick={noop} />,
        style: { display: "inline-flex", alignItems: "center" },
      },
      { node: user.name, style: { flex: 1 } },
      {
        node: (
          <Typography.Text type="secondary">
            {showMenu ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Typography.Text>
        ),
      },
    ];

    return content;
  }, [user, showMenu]);

  return (
    <div className={classes.root} onClick={() => setShowMenu(!showMenu)}>
      {showMenu && (
        <UserOptionsMenu className={classes.menu} onSelect={onSelect} />
      )}
      <SpaceOut size="middle" content={spaceOutContent} />
    </div>
  );
};

export default AppSidebarDesktopMenu;
