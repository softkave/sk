import { Tag } from "antd";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { CollaborationRequestStatusType } from "../../models/notification/notification";
import { getRequestStatus } from "./utils";

const colorMap = {
  pending: "#EACA2C",
  accepted: "#7ED321",
  declined: "rgb(255, 77, 79)",
};

export interface ICollaborationRequestStatusProps {
  request: ICollaborationRequest;
}

const CollaborationRequestStatus: React.FC<ICollaborationRequestStatusProps> = (
  props
) => {
  const { request } = props;
  const status = getRequestStatus(request);

  switch (status) {
    case CollaborationRequestStatusType.Expired:
      return <Tag style={{ color: colorMap.declined }}>Expired</Tag>;

    case CollaborationRequestStatusType.Accepted:
      return <Tag style={{ color: colorMap.accepted }}>Accepted</Tag>;

    case CollaborationRequestStatusType.Declined:
      return <Tag style={{ color: colorMap.declined }}>Declined</Tag>;

    case CollaborationRequestStatusType.Pending:
      return <Tag style={{ color: colorMap.pending }}>Pending</Tag>;

    case CollaborationRequestStatusType.Revoked:
      return <Tag style={{ color: colorMap.declined }}>Revoked</Tag>;

    default:
      return null;
  }
};

export default React.memo(CollaborationRequestStatus);
