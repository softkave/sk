import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { appRequestsPaths } from "../../models/app/routes";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getUserRequestsFromStore } from "../../redux/collaborationRequests/selectors";
import { getUserRequestsOpAction } from "../../redux/operations/collaborationRequest/getUserRequests";
import OperationType from "../../redux/operations/OperationType";
import { IAppState } from "../../redux/types";
import { useAppDispatch } from "../hooks/redux";
import useOperation, { IOperationDerivedData } from "../hooks/useOperation";

export function useUserRequests() {
  const dispatch = useAppDispatch();
  const loadRequests = React.useCallback(
    async (loadRequestsProps: IOperationDerivedData) => {
      const operation = loadRequestsProps.operation;
      const shouldLoad = !operation;

      if (shouldLoad) {
        await dispatch(
          getUserRequestsOpAction({
            opId: loadRequestsProps.opId,
          })
        );
      }
    },
    [dispatch]
  );

  const requestsOp = useOperation(
    { type: OperationType.GetUserRequests },
    loadRequests,
    {
      deleteManagedOperationOnUnmount: false,
    }
  );

  const errorMessage = requestsOp.error ? "Error loading requests" : undefined;
  const isLoading = requestsOp.isLoading;
  const requests = useSelector<IAppState, ICollaborationRequest[]>((state) => {
    if (!requestsOp.isCompleted) {
      return [];
    }

    return getUserRequestsFromStore(state);
  });

  const history = useHistory();
  const [searchQuery, setSearchQuery] = React.useState("");
  const requestRouteMatch = useRouteMatch<{ requestId: string }>(
    appRequestsPaths.requestSelector
  );

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
        return request.from?.blockName.toLowerCase().includes(searchTextLower);
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
