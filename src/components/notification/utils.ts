import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import {
  CollaborationRequestStatusType,
  INotification,
} from "../../models/notification/notification";

export function getNotificationLatestStatus(notification: INotification) {
  if (Array.isArray(notification.statusHistory)) {
    const possibleUserResponses = {
      [CollaborationRequestStatusType.Accepted]: true,
      [CollaborationRequestStatusType.Declined]: true,
    };

    return notification.statusHistory.find(({ status }) => {
      return possibleUserResponses[status];
    });
  }

  return null;
}

export function canRespondToNotification(notification: ICollaborationRequest) {
  const statusHistory = notification.statusHistory;
  const invalidStatuses = {
    [CollaborationRequestStatusType.Accepted]: true,
    [CollaborationRequestStatusType.Declined]: true,
    [CollaborationRequestStatusType.Revoked]: true,
  };

  if (Array.isArray(statusHistory)) {
    return (
      statusHistory.findIndex(({ status }) => {
        return invalidStatuses[status];
      }) !== -1
    );
  }

  return false;
}
