import { css } from "@emotion/css";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import Message from "../Message";
import List from "../styled/List";
import CollaborationRequestThumbnail from "./CollaborationRequestThumbnail";

export interface ICollaborationRequestListProps {
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
  const { requests, searchQuery, onClickRequest } = props;
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
      <div key={request.customId} className={classes.item}>
        <CollaborationRequestThumbnail
          request={request}
          onClick={onClickRequest}
        />
      </div>
    );
  };

  return <List dataSource={filteredRequests} renderItem={renderItem} />;
};

export default React.memo(CollaborationRequestList);
