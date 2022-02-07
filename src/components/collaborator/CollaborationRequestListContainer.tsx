import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getOrganizationRequestsFromStore } from "../../redux/collaborationRequests/selectors";
import { getOrganizationRequestsOpAction } from "../../redux/operations/collaborationRequest/getOrganizationRequests";
import OperationType from "../../redux/operations/OperationType";
import { AppDispatch, IAppState } from "../../redux/types";
import useOperation, { IOperationDerivedData } from "../hooks/useOperation";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import CollaborationRequestList, {
  ICollaborationRequestListProps,
} from "./CollaborationRequestList";

export interface ICollaborationRequestListContainerProps
  extends Omit<ICollaborationRequestListProps, "requests"> {
  organizationId: string;
}

const CollaborationRequestListContainer: React.FC<
  ICollaborationRequestListContainerProps
> = (props) => {
  const { organizationId } = props;
  const dispatch: AppDispatch = useDispatch();
  const loadRequests = React.useCallback(
    async (loadRequestsProps: IOperationDerivedData) => {
      const operation = loadRequestsProps.operation;
      const shouldLoad = !operation;

      if (shouldLoad) {
        await dispatch(
          getOrganizationRequestsOpAction({
            organizationId,
            opId: loadRequestsProps.opId,
          })
        );
      }
    },
    [dispatch, organizationId]
  );

  const requestsOp = useOperation(
    { type: OperationType.GetOrganizationRequests },
    loadRequests,
    {
      deleteManagedOperationOnUnmount: false,
    }
  );

  const isLoading = requestsOp.isLoading;
  const requests = useSelector<IAppState, ICollaborationRequest[]>((state) => {
    if (!requestsOp.isCompleted) {
      return [];
    }

    return getOrganizationRequestsFromStore(state, organizationId);
  });

  if (isLoading) {
    return <LoadingEllipsis />;
  } else if (requestsOp.error) {
    return <MessageList fill messages={requestsOp.error} />;
  }

  return <CollaborationRequestList {...props} requests={requests} />;
};

export default React.memo(CollaborationRequestListContainer);
