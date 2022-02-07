import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { CollaborationRequestStatusType } from "../../models/notification/notification";

export const getRequestStatus = (
  request: ICollaborationRequest
): CollaborationRequestStatusType => {
  const statusHistory = request.statusHistory || [];
  const latestStatus = statusHistory[statusHistory.length - 1];

  if (latestStatus.status === CollaborationRequestStatusType.Accepted) {
    return latestStatus.status;
  }

  return latestStatus.status;
};
