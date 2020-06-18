import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import { IAppState } from "../../redux/store";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import CollaborationRequestThumbnail from "./CollaborationRequestThumbnail";

export interface ICRProps {
  organization: IBlock;
}

const CollaborationRequests: React.FC<ICRProps> = (props) => {
  const { organization } = props;
  const requests = useSelector<IAppState, INotification[]>((state) =>
    getNotificationsAsArray(state, organization.notifications!)
  );

  if (requests.length === 0) {
    return <EmptyMessage>No collaboration requests yet.</EmptyMessage>;
  }

  const renderItem = (request: INotification, i: number) => {
    return (
      <StyledContainer
        key={request.customId}
        s={{
          padding: "16px 0",
          borderTop: i === 0 ? undefined : "1px solid #d9d9d9",
        }}
      >
        <CollaborationRequestThumbnail request={request} />
      </StyledContainer>
    );
  };

  return <List dataSource={requests} renderItem={renderItem} />;
};

export default CollaborationRequests;
