import { css } from "@emotion/css";
import React from "react";
import { useRouteMatch } from "react-router";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { appOrganizationRoutes } from "../../models/organization/utils";
import Message from "../Message";
import List from "../styled/List";
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

const CollaborationRequestList: React.FC<ICollaborationRequestListProps> = (
  props
) => {
  const { requests, searchQuery, organizationId, onClickRequest } = props;
  const requestRouteMatch = useRouteMatch<{ requestId: string }>(
    `${appOrganizationRoutes.requests(organizationId)}/:requestId`
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
    return <Message message="Send a collaboration request to get started." />;
  }

  if (filteredRequests.length === 0) {
    return <Message message="Collaboration request not found." />;
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

  return <List dataSource={filteredRequests} renderItem={renderItem} />;
};

export default React.memo(CollaborationRequestList);
