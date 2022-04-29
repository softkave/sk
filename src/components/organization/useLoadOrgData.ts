import React from "react";
import { useDispatch } from "react-redux";
import { ILoadingState, loadingStateKeys } from "../../redux/key-value/types";
import { getOrganizationCollaboratorsOpAction } from "../../redux/operations/collaborator/getOrganizationCollaborators";
import { populateOrganizationRoomsOpAction } from "../../redux/operations/organization/populateOrganizationRooms";
import {
  mergeLoadingStates,
  shouldLoadState,
} from "../../redux/operations/utils";
import useLoadingState from "../hooks/useLoadingState";
import useOrganizationFromPath from "./useOrganizationFromPath";

// For loading org data necessary for initialization, like users, requests, etc.
export function useLoadOrgData(): ILoadingState {
  const dispatch = useDispatch();
  const { organization } = useOrganizationFromPath();
  const collaboratorsKey =
    organization &&
    loadingStateKeys.organizationCollaborators(organization.customId);
  const roomsKey =
    organization && loadingStateKeys.organizationRooms(organization.customId);
  const collaboratorsState = useLoadingState(collaboratorsKey);
  const roomsState = useLoadingState(roomsKey);
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

  React.useEffect(() => {
    if (
      organization &&
      roomsKey &&
      collaboratorsState?.initialized &&
      shouldLoadState(roomsState)
    ) {
      dispatch(
        populateOrganizationRoomsOpAction({
          organization,
          key: roomsKey,
        })
      );
    }
  }, [organization, roomsKey, collaboratorsState, roomsState, dispatch]);

  return mergeLoadingStates(collaboratorsState, roomsState);
}
