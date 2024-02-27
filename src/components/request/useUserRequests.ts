import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { appRequestsPaths } from "../../models/app/routes";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getUserRequestsFromStore } from "../../redux/collaborationRequests/selectors";
import { appLoadingKeys } from "../../redux/key-value/types";
import { getUserRequestsOpAction } from "../../redux/operations/collaborationRequest/getUserRequests";
import { AppDispatch, IAppState } from "../../redux/types";
import { useLoadingStateWithOp } from "../hooks/useLoadingState";

export function useUserRequests() {
  const loadRequests = React.useCallback(async (dispatch: AppDispatch) => {
    await dispatch(getUserRequestsOpAction({ key: appLoadingKeys.userCollaborationRequests }));
  }, []);

  const requestsOp = useLoadingStateWithOp({
    key: appLoadingKeys.userCollaborationRequests,
    initFn: loadRequests,
  });
  const errorMessage = requestsOp.loadingState?.error ? "Error loading requests" : undefined;
  const isLoading = requestsOp.loadingState?.isLoading;
  const requests = useSelector<IAppState, ICollaborationRequest[]>((state) => {
    if (!requestsOp.loadingState?.initialized) {
      return [];
    }

    return getUserRequestsFromStore(state);
  });

  const history = useHistory();
  const [searchQuery, setSearchQuery] = React.useState("");
  const requestRouteMatch = useRouteMatch<{ requestId: string }>(appRequestsPaths.requestSelector);
  const selectedId = requestRouteMatch?.params.requestId;
  const onSelectRequest = React.useCallback(
    (request: ICollaborationRequest) => {
      history.push(appRequestsPaths.request(request.customId));
    },
    [history]
  );

  const activeRequests = React.useMemo(() => {
    if (searchQuery) {
      const searchTextLower = searchQuery.toLowerCase();
      return requests.filter((request) => {
        return request.from?.workspaceName.toLowerCase().includes(searchTextLower);
      });
    }

    return requests;
  }, [requests, searchQuery]);

  return {
    errorMessage,
    isLoading,
    selectedId,
    requests,
    activeRequests,
    onSelectRequest,
    setSearchQuery,
  };
}
