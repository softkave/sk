import React from "react";
import { ILoadingState, loadingStateKeys } from "../../redux/key-value/types";
import { getRoomsOpAction } from "../../redux/operations/chat/getRooms";
import {
  mergeLoadingStates,
  shouldLoadState,
} from "../../redux/operations/utils";
import { useAppDispatch } from "../hooks/redux";
import useLoadingState from "../hooks/useLoadingState";
import useOrganizationReady from "../organization/useOrganizationReady";

export function useLoadChatRooms(): ILoadingState {
  const dispatch = useAppDispatch();
  const { organization } = useOrganizationReady();
  const getRoomsKey =
    organization && loadingStateKeys.getRooms(organization.customId);
  const getRoomsState = useLoadingState(getRoomsKey);

  React.useEffect(() => {
    if (organization && getRoomsKey && shouldLoadState(getRoomsState)) {
      dispatch(
        getRoomsOpAction({
          orgId: organization.customId,
          key: getRoomsKey,
        })
      );
    }
  }, [organization, getRoomsKey, getRoomsState, dispatch]);

  return mergeLoadingStates(getRoomsState);
}
