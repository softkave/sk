import React from "react";
import { ILoadingState, loadingStateKeys } from "../../redux/key-value/types";
import { getOrganizationCollaboratorsOpAction } from "../../redux/operations/collaborator/getOrganizationCollaborators";
import {
  mergeLoadingStates,
  shouldLoadState,
} from "../../redux/operations/utils";
import { useAppDispatch } from "../hooks/redux";
import useLoadingState from "../hooks/useLoadingState";
import useOrganizationFromPath from "./useOrganizationFromPath";

export function useLoadOrgData(): ILoadingState {
  const dispatch = useAppDispatch();
  const { organization } = useOrganizationFromPath();
  const collaboratorsKey =
    organization &&
    loadingStateKeys.organizationCollaborators(organization.customId);
  const collaboratorsState = useLoadingState(collaboratorsKey);

  React.useEffect(() => {
    if (
      organization &&
      collaboratorsKey &&
      shouldLoadState(collaboratorsState)
    ) {
      dispatch(
        getOrganizationCollaboratorsOpAction({
          organizationId: organization.customId,
          key: collaboratorsKey,
        })
      );
    }
  }, [organization, collaboratorsKey, collaboratorsState, dispatch]);

  return mergeLoadingStates(collaboratorsState);
}
