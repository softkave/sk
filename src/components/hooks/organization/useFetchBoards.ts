import React from "react";
import { appLoadingKeys, ILoadingState } from "../../../redux/key-value/types";
import { getOrganizationBoardsOpAction } from "../../../redux/operations/board/getOrganizationBoards";
import { AppDispatch } from "../../../redux/types";
import { useLoadingStateWithOp } from "../useLoadingState";

export function useFetchBoards(organizationId: string): ILoadingState | undefined {
  const key = appLoadingKeys.orgBoards(organizationId);
  const initFn = React.useCallback(
    (dispatch: AppDispatch) => {
      dispatch(getOrganizationBoardsOpAction({ key, organizationId }));
    },
    [organizationId, key]
  );

  const state = useLoadingStateWithOp({ key, initFn });
  return state.loadingState;
}
