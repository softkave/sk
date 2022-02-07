import React from "react";
import { useDispatch } from "react-redux";
import { IAppOrganization } from "../../models/organization/types";
import { getOrganizationCollaboratorsOpAction } from "../../redux/operations/collaborator/getOrganizationCollaborators";
import OperationType from "../../redux/operations/OperationType";
import { populateOrganizationRoomsOpAction } from "../../redux/operations/organization/populateOrganizationRooms";
import { IQueryFilterOperationSelector } from "../../redux/operations/selectors";
import useOperation, {
  IMergedOperationStats,
  IOperationDerivedData,
  mergeOps,
} from "../hooks/useOperation";

// For loading org data necessary for initialization, like users, requests, etc.
export function useLoadOrgData(org: IAppOrganization): IMergedOperationStats {
  const dispatch = useDispatch();
  const loadCollaborators = React.useCallback(
    (loadProps: IOperationDerivedData) => {
      if (!loadProps.operation) {
        dispatch(
          getOrganizationCollaboratorsOpAction({
            organizationId: org.customId,
            opId: loadProps.opId,
          })
        );
      }
    },
    [org, dispatch]
  );

  const loadCollaboratorsOpSelector: IQueryFilterOperationSelector = {
    resourceId: org.customId,
    type: OperationType.GetOrganizationCollaborators,
  };

  const loadCollaboratorsOp = useOperation(
    loadCollaboratorsOpSelector,
    loadCollaborators
  );

  const populateOrgRooms = React.useCallback(
    (loadProps: IOperationDerivedData) => {
      if (!loadProps.operation) {
        dispatch(
          populateOrganizationRoomsOpAction({
            organization: org,
            opId: loadProps.opId,
          })
        );
      }
    },
    [org, dispatch]
  );

  const populateOrgRoomsOp = useOperation(
    {
      resourceId: org.customId,
      type: OperationType.PopulateOrganizationRooms,
    },
    populateOrgRooms,
    { waitFor: [loadCollaboratorsOpSelector] }
  );

  return mergeOps([loadCollaboratorsOp, populateOrgRoomsOp]);
}
