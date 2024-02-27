import React from "react";
import { SystemResourceType } from "../../models/app/types";
import { ICollaborator } from "../../models/collaborator/types";
import { appLoadingKeys } from "../../redux/key-value/types";
import { getOrganizationCollaboratorsOpAction } from "../../redux/operations/collaborator/getOrganizationCollaborators";
import { useAppDispatch } from "../hooks/redux";
import { useMapListContainerNotPaginated } from "../hooks/useMapListContainer";

export function useFetchOrganizationCollaborators(props: { organizationId: string }) {
  const { organizationId } = props;
  const dispatch = useAppDispatch();
  const loadingKey = appLoadingKeys.organizationCollaborators(organizationId);
  const fetchData = React.useCallback(() => {
    dispatch(
      getOrganizationCollaboratorsOpAction({
        organizationId,
        key: loadingKey,
      })
    );
  }, [organizationId]);

  const data = useMapListContainerNotPaginated<ICollaborator>({
    loadingKey,
    mapKey: SystemResourceType.User,
    opAction: fetchData,
    omitItems: true,
  });

  return data;
}
