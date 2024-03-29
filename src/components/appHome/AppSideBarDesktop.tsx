import { css } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { appLoggedInPaths, appOrganizationPaths } from "../../models/app/routes";
import { IUser } from "../../models/user/types";
import OrganizationListContainer from "../organization/OrganizationListContainer";
import OrganizationSidebarContainer from "../organization/OrganizationSidebarContainer";
import RequestListContainer from "../request/RequestListContainer";
import { IAppRoute } from "../utils/types";
import AppSidebarDesktopMenu from "./AppSidebarDesktopMenu";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppSideBarDesktopProps {
  user: IUser;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const classes = {
  root: css({
    display: "grid",
    height: "100%",
    width: "320px",
    minWidth: "320px",
    borderRight: "2px solid rgb(223, 234, 240)",
    gridTemplateRows: "auto 1fr auto",
  }),
  title: css({
    margin: "0px !important",
    fontSize: "16px",
    lineHeight: "16px !important",
    alignItems: "center",
    display: "flex",
    height: "56px",
    padding: "0 16px",
    borderBottom: "2px solid rgb(223, 234, 240)",
  }),
  boardsBy: css({
    fontSize: "14px",
    lineHeight: "16px",
  }),
  titleLink: css({ color: "inherit !important" }),
  contentNode: css({ overflow: "hidden" }),
};

const AppSideBarDesktop: React.FC<IAppSideBarDesktopProps> = (props) => {
  const { user, onSelect } = props;
  const routeItems: IAppRoute[] = React.useMemo(
    () => [
      {
        path: appOrganizationPaths.organizationSelector,
        render: () => <OrganizationSidebarContainer isMobile={false} />,
      },
      {
        path: appLoggedInPaths.organizations,
        render: () => <OrganizationListContainer />,
      },
      {
        path: appLoggedInPaths.requests,
        render: () => <RequestListContainer />,
      },
    ],
    []
  );

  return (
    <div className={classes.root}>
      <Typography.Title type="secondary" level={4} className={classes.title}>
        <Link to="/app" className={classes.titleLink}>
          <Typography.Text type="secondary" className={classes.boardsBy}>
            Boards by <br />
            SOFTKAVE
          </Typography.Text>
        </Link>
      </Typography.Title>
      <div className={classes.contentNode}>
        <Switch>
          {routeItems.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Switch>
      </div>
      <AppSidebarDesktopMenu user={user} onSelect={onSelect} />
    </div>
  );
};

export default AppSideBarDesktop;
