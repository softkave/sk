import { INotification } from "../../models/notification/notification";
import { IReferenceCountedResource } from "../referenceCounting";
import {
  BULK_ADD_NOTIFICATIONS,
  BULK_DELETE_NOTIFICATIONS,
  BULK_UPDATE_NOTIFICATIONS
} from "./constants";

export interface IUpdateNotificationParams {
  id: string;
  notification: INotification;
}

export interface IReduxNotification
  extends INotification,
    IReferenceCountedResource {}

export function addNotification(
  notification: IReduxNotification
): IBulkAddNotificationsAction {
  return bulkAddNotifications([notification]);
}

export function updateNotification(
  notification: IUpdateNotificationParams
): IBulkUpdateNotificationsAction {
  return bulkUpdateNotifications([notification]);
}

export function deleteNotification(
  notification: string
): IBulkDeleteNotificationsAction {
  return bulkDeleteNotifications([notification]);
}

export interface IBulkAddNotificationsAction {
  type: BULK_ADD_NOTIFICATIONS;
  payload: {
    notifications: INotification[];
  };
}

export function bulkAddNotifications(
  notifications: INotification[]
): IBulkAddNotificationsAction {
  return {
    type: BULK_ADD_NOTIFICATIONS,
    payload: {
      notifications
    }
  };
}

export interface IBulkUpdateNotificationsAction {
  type: BULK_UPDATE_NOTIFICATIONS;
  payload: {
    notifications: IUpdateNotificationParams[];
  };
}

export function bulkUpdateNotifications(
  notifications: IUpdateNotificationParams[]
): IBulkUpdateNotificationsAction {
  return {
    type: BULK_UPDATE_NOTIFICATIONS,
    payload: {
      notifications
    }
  };
}

export interface IBulkDeleteNotificationsAction {
  type: BULK_DELETE_NOTIFICATIONS;
  payload: {
    notifications: string[];
  };
}

export function bulkDeleteNotifications(
  notifications: string[]
): IBulkDeleteNotificationsAction {
  return {
    type: BULK_DELETE_NOTIFICATIONS,
    payload: {
      notifications
    }
  };
}
