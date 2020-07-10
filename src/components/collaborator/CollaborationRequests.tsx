import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { getNotifications } from "../../redux/notifications/selectors";
import { IAppState } from "../../redux/types";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import CollaborationRequestThumbnail from "./CollaborationRequestThumbnail";

export interface ICRProps {
  organization: IBlock;

  searchQuery?: string;
  getRequestStyle?: (
    request: INotification,
    index: number
  ) => React.CSSProperties;
}

const CollaborationRequests: React.FC<ICRProps> = (props) => {
  const { organization, getRequestStyle, searchQuery } = props;
  const requests = useSelector<IAppState, INotification[]>((state) =>
    getNotifications(state, organization.notifications!)
  );

  if (requests.length === 0) {
    return <EmptyMessage>No collaboration requests yet</EmptyMessage>;
  }

  const filterRequests = () => {
    if (!searchQuery) {
      return requests;
    }

    const lowerCasedSearchQuery = searchQuery.toLowerCase();
    return requests.filter((request) =>
      request.to.email.toLowerCase().includes(lowerCasedSearchQuery)
    );
  };

  const filteredRequests = filterRequests();

  if (filteredRequests.length === 0) {
    return <EmptyMessage>Requests not found</EmptyMessage>;
  }

  const renderItem = (request: INotification, i: number) => {
    return (
      <StyledContainer
        key={request.customId}
        s={getRequestStyle ? getRequestStyle(request, i) : undefined}
      >
        <CollaborationRequestThumbnail request={request} />
      </StyledContainer>
    );
  };

  return <List dataSource={filteredRequests} renderItem={renderItem} />;
};

export default CollaborationRequests;
