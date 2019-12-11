import React from "react";
import { IBlock } from "../../models/block/block";
import { useSelector } from "react-redux";
import { IReduxState } from "../../redux/store";
import useOperation from "../hooks/useOperation";
import { getBlockCollaborationRequestsOperationID } from "../../redux/operations/operationIDs";
import GeneralError from "../GeneralError";
import EmptyContainer from "../Empty";
import List from "../styled/List";
import { INotification } from "../../models/notification/notification";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import CollaborationRequestThumbnail from "./CollaborationRequestThumbnail";

export interface ICRProps {
  organization: IBlock;
}

const CR: React.FC<ICRProps> = props => {
  const { organization } = props;
  const requests = useSelector<IReduxState, INotification[]>(state => getNotificationsAsArray(state, organization.collaborationRequests));
  const requestsStatus = useOperation({ operationID: getBlockCollaborationRequestsOperationID, resourceID: organization.customId });

  if (requestsStatus.error) {
    return <GeneralError error={requestsStatus.error} />
  } else if (requests.length === 0) {
    return <EmptyContainer>No collaboration requests yet.</EmptyContainer>
  }

  const renderItem = (request: INotification) => {
    return <CollaborationRequestThumbnail request={request} />
  }

  const getCollaboratorID = (request: INotification) => {
    return request.customId
  }

  return (
    <List 
      dataSource={requests}
      rowKey={getCollaboratorID}
      renderItem={renderItem}
    />
  )
}

export default CR;
