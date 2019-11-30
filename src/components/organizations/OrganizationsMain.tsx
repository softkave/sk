import React from "react";
import { Route, Switch } from "react-router-dom";
import Organization from "./Organization";
import OrganizationListContainer from "./OrganizationListContainer";

export interface IOrganizationsPathParams {
  organizationID?: string;
}

const OrganizationsMain: React.SFC<{}> = props => {
  return (
    <Switch>
      <Route
        exact
        path="/app/organizations"
        component={OrganizationListContainer}
      />
      <Route
        path="/app/organizations/:organizationID"
        component={Organization}
      />
    </Switch>
  );
};

export default OrganizationsMain;
