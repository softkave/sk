import React from "react";
import OrganizationListContainer from "./OrganizationListContainer";

export interface IOrganizationsPathParams {
  organizationID?: string;
}

const OrganizationsMain: React.SFC<{}> = props => {
  return <OrganizationListContainer />;
};

export default OrganizationsMain;
