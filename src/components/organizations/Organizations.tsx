import React from "react";
import { useRouteMatch } from "react-router";
import { Route, Switch } from "react-router-dom";
import Organization from "./Organization";
import OrganizationListContainer from "./OrganizationListContainer";

const OrganizationsMain: React.SFC<{}> = props => {
  // TODO: Report to analytics server if routeMatch is empty, or tell the user browser not supported
  const routeMatch = useRouteMatch()!;

  return (
    <Switch>
      <Route
        exact
        path={routeMatch.path}
        component={OrganizationListContainer}
      />
      <Route
        path={`${routeMatch.path}/:organizationID`}
        component={Organization}
      />
    </Switch>
  );
};

export default OrganizationsMain;
