import React from "react";
import { SystemActionType, SystemResourceType } from "../../models/app/types";
import subscribeEvent from "../../net/socket/outgoing/subscribeEvent";
import unsubcribeEvent from "../../net/socket/outgoing/unsubscribeEvent";
import OrganizationSidebar, { IWorkspaceSidebarProps } from "./OrganizationSidebar";
import useOrganizationIdFromPath from "./useOrganizationIdFromPath";
import useOrganizationReady from "./useOrganizationReady";

export interface IWorkspaceSidebarContainerProps extends IWorkspaceSidebarProps {}

const OrganizationSidebarContainer: React.FC<IWorkspaceSidebarContainerProps> = (props) => {
  const { organizationId } = useOrganizationIdFromPath();
  const { stateNode } = useOrganizationReady();

  React.useEffect(() => {
    if (organizationId) {
      // TODO: subscribe to auth updates if can read permissions
      subscribeEvent([
        {
          type: SystemResourceType.Workspace,
          customId: organizationId,
          action: SystemActionType.Read,
        },
      ]);
    }

    return () => {
      if (organizationId) {
        unsubcribeEvent([{ type: SystemResourceType.Workspace, customId: organizationId }]);
      }
    };
  }, [organizationId]);

  if (stateNode) {
    return stateNode;
  }

  return <OrganizationSidebar {...props} />;
};

export default React.memo(OrganizationSidebarContainer);
