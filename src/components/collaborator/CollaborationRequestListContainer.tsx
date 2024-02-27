import React from "react";
import { useSelector } from "react-redux";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getOrganizationRequestsFromStore } from "../../redux/collaborationRequests/selectors";
import { appLoadingKeys } from "../../redux/key-value/types";
import { getOrganizationRequestsOpAction } from "../../redux/operations/collaborationRequest/getOrganizationRequests";
import { AppDispatch, IAppState } from "../../redux/types";
import { useLoadingNode } from "../hooks/useLoadingNode";
import { useLoadingStateWithOp } from "../hooks/useLoadingState";
import CollaborationRequestList, {
  ICollaborationRequestListProps,
} from "./CollaborationRequestList";

export interface ICollaborationRequestListContainerProps
  extends Omit<ICollaborationRequestListProps, "requests"> {
  organizationId: string;
}

const CollaborationRequestListContainer: React.FC<ICollaborationRequestListContainerProps> = (
  props
) => {
  const { organizationId } = props;
  const loadRequests = React.useCallback(
    async (dispatch: AppDispatch) => {
      await dispatch(
        getOrganizationRequestsOpAction({
          organizationId,
          key: appLoadingKeys.organizationRequests(organizationId),
        })
      );
    },
    [organizationId]
  );

  const requestsOp = useLoadingStateWithOp({
    key: appLoadingKeys.organizationRequests(organizationId),
    initFn: loadRequests,
  });

  const requests = useSelector<IAppState, ICollaborationRequest[]>((state) => {
    if (!requestsOp.loadingState?.initialized) {
      return [];
    }
    return getOrganizationRequestsFromStore(state, organizationId);
  });

  const loadingNode = useLoadingNode(requestsOp.loadingState);
  if (loadingNode.stateNode) {
    return loadingNode.stateNode;
  }

  return <CollaborationRequestList {...props} requests={requests} />;
};

export default React.memo(CollaborationRequestListContainer);
