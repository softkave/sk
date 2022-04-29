import { Typography } from "antd";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { CollaborationRequestStatusType } from "../../models/notification/notification";
import { appClassNames } from "../classNames";
import { getRequestStatus } from "../collaborator/utils";
import Message from "../Message";
import RequestThumbnail from "./RequestThumbnail";

export interface IRequestListProps {
  requests: ICollaborationRequest[];
  selectedId?: string;
  onClickRequest: (request: ICollaborationRequest) => void;
}

const requestStatusWeight: Record<CollaborationRequestStatusType, number> = {
  [CollaborationRequestStatusType.Pending]: 0,
  [CollaborationRequestStatusType.Accepted]: 1,
  [CollaborationRequestStatusType.Declined]: 2,
  [CollaborationRequestStatusType.Revoked]: 3,
  [CollaborationRequestStatusType.Expired]: 4,
};

const RequestList: React.FC<IRequestListProps> = (props) => {
  const { requests, selectedId, onClickRequest } = props;
  const sortedRequests = React.useMemo(() => {
    return requests
      .sort((r1, r2) => {
        const s1 = getRequestStatus(r1);
        const s2 = getRequestStatus(r2);
        return requestStatusWeight[s1] - requestStatusWeight[s2];
      })
      .filter((r1) => {
        const s1 = getRequestStatus(r1);
        return s1 === CollaborationRequestStatusType.Pending;
      });
  }, [requests]);

  if (requests.length === 0) {
    return <Message message="You have no collaboration requests." />;
  }

  return (
    <div className={appClassNames.pageListRoot}>
      <Typography.Text
        type="secondary"
        style={{ padding: "0 16px", textTransform: "uppercase" }}
      >
        Requests
      </Typography.Text>
      {sortedRequests.map((request) => {
        return (
          <RequestThumbnail
            key={request.customId}
            onClick={() => onClickRequest(request)}
            request={request}
            isSelected={selectedId === request.customId}
            className={appClassNames.pageListItem}
          />
        );
      })}
    </div>
  );
};

export default React.memo(RequestList);
