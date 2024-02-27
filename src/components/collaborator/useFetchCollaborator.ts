import React from "react";
import { SystemResourceType } from "../../models/app/types";
import { ICollaborator } from "../../models/collaborator/types";
import { IEndpointQueryPaginationOptions } from "../../models/types";
import { appLoadingKeys } from "../../redux/key-value/types";
import { useAppDispatch } from "../hooks/redux";
import { useMapListItem } from "../hooks/useMapListItem";

export function useFetchCollaborator(props: {
  organizationId: string;
  containerId: string;
  containerType: SystemResourceType;
  collaboratorId: string;
}) {
  const { organizationId, containerId, containerType, collaboratorId } = props;
  const dispatch = useAppDispatch();
  const loadingKey = appLoadingKeys.permissionGroups(containerId, containerType);
  const fetchData = React.useCallback(
    (pageArgs: IEndpointQueryPaginationOptions) => {
      // TODO: complete
      throw new Error("not implemented yet");
    },
    [organizationId, containerId, containerType, collaboratorId]
  );

  const dt = useMapListItem<ICollaborator>({
    loadingKey,
    mapKey: SystemResourceType.User,
    opAction: fetchData,
    customId: collaboratorId,
  });

  return dt;
}
