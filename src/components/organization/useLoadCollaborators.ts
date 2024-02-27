import React from "react";
import { appLoadingKeys, ILoadingState } from "../../redux/key-value/types";
import { getOrganizationCollaboratorsOpAction } from "../../redux/operations/collaborator/getOrganizationCollaborators";
import { AppDispatch } from "../../redux/types";
import { IUseLoadingStateWithOpResult, useLoadingStateWithOp } from "../hooks/useLoadingState";

export function useLoadCollaborators(
  organizationId: string
): IUseLoadingStateWithOpResult<ILoadingState> {
  const collaboratorsKey = appLoadingKeys.organizationCollaborators(organizationId);
  const getCollaboratorsInitFn = React.useCallback(
    (dispatch: AppDispatch) => {
      dispatch(
        getOrganizationCollaboratorsOpAction({
          organizationId,
          key: collaboratorsKey,
        })
      );
    },
    [organizationId, collaboratorsKey]
  );

  const op = useLoadingStateWithOp({ key: collaboratorsKey, initFn: getCollaboratorsInitFn });
  return op;
}
