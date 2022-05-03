import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  appLoggedInPaths,
  appOrganizationPaths,
  appRequestsPaths,
} from "../../models/app/routes";
import SessionSelectors from "../../redux/session/selectors";
import Notification from "../notification/Notification";
import OrganizationListContainer from "../organization/OrganizationListContainer";
import UserSettings from "../user/UserSettings";
import HeaderMobile from "./HeaderMobile";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeMobileProps {
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const AppHomeMobile: React.FC<IAppHomeMobileProps> = (props) => {
  const { onSelect } = props;
  const user = useSelector(SessionSelectors.assertGetUser);
  const renderNotification = () => <Notification />;
  const renderSettings = () => <UserSettings />;
  return (
    <div style={{ flexDirection: "column", height: "100%" }}>
      <HeaderMobile user={user} onSelect={onSelect} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Switch>
          <Route
            path={appRequestsPaths.requestSelector}
            render={renderNotification}
          />
          <Route
            exact
            path={appLoggedInPaths.organizations}
            component={OrganizationListContainer}
          />
          <Route
            path={appOrganizationPaths.organizationSelector}
            render={() => {
              return null;
            }}
          />
          <Route
            exact
            path={appLoggedInPaths.settings}
            render={renderSettings}
          />
          <Route
            exact
            path="*"
            render={() => <Redirect to={appLoggedInPaths.organizations} />}
          />
        </Switch>
      </div>
    </div>
  );
};

export default AppHomeMobile;
