import isNumber from "lodash/isNumber";
import {
  INotification,
  notificationStatus
} from "../../models/notification/notification";

export function getNotificationLatestStatus(notification: INotification) {
  if (Array.isArray(notification.statusHistory)) {
    const possibleUserResponses = {
      [notificationStatus.accepted]: true,
      [notificationStatus.declined]: true
    };

    return notification.statusHistory.find(({ status }) => {
      return possibleUserResponses[status];
    });
  }

  return null;
}

export function canRespondToNotification(notification: INotification) {
  if (isNotificationExpired(notification)) {
    return false;
  }

  const statusHistory = notification.statusHistory;
  const invalidStatuses = {
    [notificationStatus.accepted]: true,
    [notificationStatus.declined]: true,
    [notificationStatus.revoked]: true
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

export function isNotificationExpired(notification: INotification) {
  if (isNumber(notification.expiresAt)) {
    return notification.expiresAt < Date.now();
  }

  return false;
}

export interface INotificationsPathParams {
  notificationID?: string;
}
