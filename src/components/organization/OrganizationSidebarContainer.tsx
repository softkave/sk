import React from "react";
import { SystemResourceType } from "../../models/app/types";
import subscribeEvent from "../../net/socket/outgoing/subscribeEvent";
import unsubcribeEvent from "../../net/socket/outgoing/unsubscribeEvent";
import OrganizationSidebar, {
  IOrganizationSidebarProps,
} from "./OrganizationSidebar";
import useOrganizationIdFromPath from "./useOrganizationIdFromPath";
import useOrganizationReady from "./useOrganizationReady";

export interface IOrganizationSidebarContainerProps
  extends IOrganizationSidebarProps {}

const OrganizationSidebarContainer: React.FC<
  IOrganizationSidebarContainerProps
> = (props) => {
  const { organizationId } = useOrganizationIdFromPath();
  const { stateNode } = useOrganizationReady();
  React.useEffect(() => {
    if (organizationId) {
      subscribeEvent([
        { type: SystemResourceType.Org, customId: organizationId },
      ]);
    }

    return () => {
      if (organizationId) {
        unsubcribeEvent([
          { type: SystemResourceType.Org, customId: organizationId },
        ]);
      }
    };
  }, [organizationId]);

  if (stateNode) {
    return stateNode;
  }

  return <OrganizationSidebar {...props} />;
};

export default React.memo(OrganizationSidebarContainer);
