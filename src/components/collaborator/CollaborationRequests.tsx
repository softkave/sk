import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import { getBlockCollaborationRequestsOperationID } from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import EmptyMessage from "../EmptyMessage";
import GeneralError from "../GeneralError";
import useOperation from "../hooks/useOperation";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import CollaborationRequestThumbnail from "./CollaborationRequestThumbnail";

export interface ICRProps {
  organization: IBlock;
}

const CollaborationRequests: React.FC<ICRProps> = props => {
  const { organization } = props;
  const requests = useSelector<IReduxState, INotification[]>(state =>
    getNotificationsAsArray(state, organization.collaborationRequests!)
  );
  const requestsStatus = useOperation({
    operationID: getBlockCollaborationRequestsOperationID,
    resourceID: organization.customId
  });

  if (requestsStatus.error) {
    return (
      <StyledContainer
        s={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <GeneralError error={requestsStatus.error} />
      </StyledContainer>
    );
  } else if (requests.length === 0) {
    return <EmptyMessage>No collaboration requests yet.</EmptyMessage>;
  }

  const renderItem = (request: INotification) => {
    return (
      <StyledContainer s={{ padding: "16px 0" }}>
        <CollaborationRequestThumbnail request={request} />
      </StyledContainer>
    );
  };

  const getCollaboratorID = (request: INotification) => {
    return request.customId;
  };

  return (
    <List
      dataSource={requests}
      rowKey={getCollaboratorID}
      renderItem={renderItem}
    />
  );
};

export default CollaborationRequests;
