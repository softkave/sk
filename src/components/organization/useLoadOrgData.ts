import React from "react";
import { useDispatch } from "react-redux";
import { ILoadingState, loadingStateKeys } from "../../redux/key-value/types";
import { getOrganizationCollaboratorsOpAction } from "../../redux/operations/collaborator/getOrganizationCollaborators";
import {
  mergeLoadingStates,
  shouldLoadState,
} from "../../redux/operations/utils";
import useLoadingState from "../hooks/useLoadingState";
import useOrganizationFromPath from "./useOrganizationFromPath";

export function useLoadOrgData(): ILoadingState {
  const dispatch = useDispatch();
  const { organization } = useOrganizationFromPath();
  const collaboratorsKey =
    organization &&
    loadingStateKeys.organizationCollaborators(organization.customId);
  const collaboratorsState = useLoadingState(collaboratorsKey);
  React.useEffect(() => {
    console.log({ organization, collaboratorsKey, collaboratorsState });

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
