import React from "react";
import { useDispatch } from "react-redux";
import { ILoadingState, loadingStateKeys } from "../../redux/key-value/types";
import { getRoomsOpAction } from "../../redux/operations/chat/getRooms";
import {
  mergeLoadingStates,
  shouldLoadState,
} from "../../redux/operations/utils";
import useLoadingState from "../hooks/useLoadingState";
import useOrganizationFromPath from "../organization/useOrganizationFromPath";

export function useLoadChatRooms(): ILoadingState {
  const dispatch = useDispatch();
  const { organization } = useOrganizationFromPath();
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
