import { css } from "@emotion/css";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { appLoggedInPaths, appOrganizationPaths, appRequestsPaths } from "../../models/app/routes";
import SessionSelectors from "../../redux/session/selectors";
import Message from "../PageMessage";
import Notification from "../notification/Notification";
import OrganizationRoutesContainer from "../organization/OrganizationRoutesContainer";
import UserSettings from "../user/UserSettings";
import AppSideBarDesktop from "./AppSideBarDesktop";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeDesktopProps {
  showAppMenu?: boolean;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const classes = {
  root: css({
    display: "flex",
    height: "100%",
    overflow: "hidden",
  }),
};

const AppHomeDesktop: React.FC<IAppHomeDesktopProps> = (props) => {
  const { showAppMenu, onSelect } = props;
  const user = useSelector(SessionSelectors.assertGetUser);
  const renderNotification = () => <Notification />;
  const renderSettings = () => <UserSettings />;
  const renderEmpty = (str: string = "Select an organization or request") => (
    <Message message={str} />
  );

  return (
    <div className={classes.root}>
      {showAppMenu && <AppSideBarDesktop user={user} onSelect={onSelect} />}
      <Switch>
        <Route
          exact
          path={appLoggedInPaths.requests}
          render={() => renderEmpty("Select a request")}
        />
        <Route path={appRequestsPaths.requestSelector} render={renderNotification} />
        <Route
          exact
          path={appLoggedInPaths.organizations}
          render={() => renderEmpty("Select or create an organization to get started")}
        />
        <Route
          path={appOrganizationPaths.organizationSelector}
          render={() => {
            return <OrganizationRoutesContainer />;
          }}
        />
        <Route exact path={appLoggedInPaths.settings} render={renderSettings} />
        <Route exact path="*" render={() => <Redirect to={appLoggedInPaths.organizations} />} />
      </Switch>
    </div>
  );
};

export default AppHomeDesktop;
