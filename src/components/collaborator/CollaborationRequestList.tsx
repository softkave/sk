import { css } from "@emotion/css";
import React from "react";
import { useRouteMatch } from "react-router";
import { appOrganizationPaths } from "../../models/app/routes";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import Message from "../PageMessage";
import ItemList from "../utils/list/ItemList";
import CollaborationRequestThumbnail from "./CollaborationRequestThumbnail";

export interface ICollaborationRequestListProps {
  organizationId: string;
  requests: ICollaborationRequest[];
  onClickRequest: (request: ICollaborationRequest) => void;
  searchQuery?: string;
}

const classes = {
  item: css({ padding: "8px 16px" }),
};

const CollaborationRequestList: React.FC<ICollaborationRequestListProps> = (props) => {
  const { requests, searchQuery, organizationId, onClickRequest } = props;
  const requestRouteMatch = useRouteMatch<{ requestId: string }>(
    `${appOrganizationPaths.requests(organizationId)}/:requestId`
  );

  const filteredRequests = React.useMemo(() => {
    if (!searchQuery) {
      return requests;
    }

    const lowerCasedSearchQuery = searchQuery.toLowerCase();
    return requests.filter((request) =>
      request.to.email.toLowerCase().includes(lowerCasedSearchQuery)
    );
  }, [requests, searchQuery]);

  if (requests.length === 0) {
    return <Message message="Send a collaboration request to get started" />;
  }

  if (filteredRequests.length === 0) {
    return <Message message="Collaboration request not found" />;
  }

  const renderItem = (request: ICollaborationRequest) => {
    return (
      <CollaborationRequestThumbnail
        request={request}
        onClick={onClickRequest}
        key={request.customId}
        className={classes.item}
        isSelected={request.customId === requestRouteMatch?.params.requestId}
      />
    );
  };

  return <ItemList items={filteredRequests} renderItem={renderItem} />;
};

export default React.memo(CollaborationRequestList);
