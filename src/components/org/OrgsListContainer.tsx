import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { IAppOrganization } from "../../models/organization/types";
import { getUserRequestsFromStore } from "../../redux/collaborationRequests/selectors";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import {
  IUnseenChatsCountByOrg,
  KeyValueKeys,
} from "../../redux/key-value/types";
import { getUserRoomsAndChatsOpAction } from "../../redux/operations/chat/getUserRoomsAndChats";
import { getUserRequestsOpAction } from "../../redux/operations/collaborationRequest/getUserRequests";
import OperationType from "../../redux/operations/OperationType";
import { getUserOrganizationsOpAction } from "../../redux/operations/organization/getUserOrganizations";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import useOperation, {
  IOperationDerivedData,
  mergeOps,
} from "../hooks/useOperation";
import OrgsMain from "./OrgsMain";

export interface IOrgsListContainerProps {
  hijackRender?: () => React.ReactElement;
}

const OrgsListContainer: React.FC<IOrgsListContainerProps> = (props) => {
  const { hijackRender } = props;
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const unseenChatsCountMapByOrg = useSelector<
    IAppState,
    IUnseenChatsCountByOrg
  >((state) =>
    KeyValueSelectors.getKey(state, KeyValueKeys.UnseenChatsCountByOrg)
  );

  const orgRouteMatch = useRouteMatch<{ orgId: string }>("/app/orgs/:orgId");
  const requestRouteMatch = useRouteMatch<{ requestId: string }>(
    "/app/notifications/:requestId"
  );

  const selectedId =
    orgRouteMatch?.params.orgId || requestRouteMatch?.params.requestId;

  const loadUserRoomsAndChats = React.useCallback(
    async (loadRequestsProps: IOperationDerivedData) => {
      const operation = loadRequestsProps.operation;
      const shouldLoad = !operation;

      if (shouldLoad) {
        await dispatch(
          getUserRoomsAndChatsOpAction({
            opId: loadRequestsProps.opId,
          })
        );
      }
    },
    [dispatch]
  );

  const loadRoomsAndChatsOp = useOperation(
    { type: OperationType.GetUserRoomsAndChats },
    loadUserRoomsAndChats,
    {
      deleteManagedOperationOnUnmount: false,
    }
  );

  const loadOrgs = React.useCallback(
    async (loadOrgsProps: IOperationDerivedData) => {
      const operation = loadOrgsProps.operation;
      const shouldLoad = !operation;

      if (shouldLoad) {
        await dispatch(
          getUserOrganizationsOpAction({ opId: loadOrgsProps.opId })
        );

        dispatch(
          KeyValueActions.setKey({
            key: KeyValueKeys.RootBlocksLoaded,
            value: true,
          })
        );
      }
    },
    [dispatch]
  );

  const orgsOp = useOperation(
    { type: OperationType.GetUserOrganizations },
    loadOrgs,
    {
      deleteManagedOperationOnUnmount: false,
      waitFor: [loadRoomsAndChatsOp.operation],
      handleWaitForError: () => false,
    }
  );

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

  const loadOpsState = mergeOps([orgsOp, requestsOp, loadRoomsAndChatsOp]);
  const errorMessage = loadOpsState.errors ? "Error loading data" : undefined;
  const isLoading = loadOpsState.loading;
  const orgs = useSelector<IAppState, IAppOrganization[]>((state) => {
    if (!orgsOp.isCompleted) {
      return [];
    }

    return OrganizationSelectors.getAll(state);
  });

  const requests = useSelector<IAppState, ICollaborationRequest[]>((state) => {
    if (!requestsOp.isCompleted) {
      return [];
    }

    return getUserRequestsFromStore(state);
  });

  const onAddOrg = React.useCallback(() => {
    dispatch(
      KeyValueActions.setKey({
        key: KeyValueKeys.ShowNewOrgForm,
        value: true,
      })
    );
  }, [dispatch]);

  const onSelectOrg = React.useCallback(
    (org: IAppOrganization) => {
      history.push(`/app/orgs/${org.customId}`);
    },
    [history]
  );

  const onSelectRequest = React.useCallback(
    (request: ICollaborationRequest) => {
      history.push(`/app/notifications/${request.customId}`);
    },
    [history]
  );

  if (hijackRender) {
    return hijackRender();
  }

  return (
    <OrgsMain
      orgs={orgs}
      requests={requests}
      unseenChatsCountMapByOrg={unseenChatsCountMapByOrg}
      errorMessage={errorMessage}
      isLoading={isLoading}
      selectedId={selectedId}
      onAddOrg={onAddOrg}
      onSelectOrg={onSelectOrg}
      onSelectRequest={onSelectRequest}
    />
  );
};

export default React.memo(OrgsListContainer);
