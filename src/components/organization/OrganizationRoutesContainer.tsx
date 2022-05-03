import React from "react";
import OrganizationRoutes from "./OrganizationRoutes";
import useOrganizationReady from "./useOrganizationReady";

export interface IOrganizationRoutesContainerProps {}

const OrganizationRoutesContainer: React.FC<
  IOrganizationRoutesContainerProps
> = (props) => {
  const { stateNode } = useOrganizationReady();

  if (stateNode) {
    return stateNode;
  }

  return <OrganizationRoutes />;
};

export default React.memo(OrganizationRoutesContainer);
