import React from "react";
import OrganizationRoutes from "./OrganizationRoutes";
import useOrganizationReady from "./useOrganizationReady";

export interface IWorkspaceRoutesContainerProps {}

const OrganizationRoutesContainer: React.FC<IWorkspaceRoutesContainerProps> = (props) => {
  const { stateNode } = useOrganizationReady();

  if (stateNode) {
    return stateNode;
  }

  return <OrganizationRoutes />;
};

export default React.memo(OrganizationRoutesContainer);
