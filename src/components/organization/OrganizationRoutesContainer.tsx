import React from "react";
import OrganizationRoutes from "./OrganizationRoutes";
import useOrganizationReady from "./useOrganizationReady";

export interface IOrganizationRoutesContainerProps {}

const OrganizationRoutesContainer: React.FC<
  IOrganizationRoutesContainerProps
> = (props) => {
  const { returnNode } = useOrganizationReady();

  if (returnNode) {
    return returnNode;
  }

  return <OrganizationRoutes />;
};

export default React.memo(OrganizationRoutesContainer);
