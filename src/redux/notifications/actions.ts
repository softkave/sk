import { INotification } from "../../models/notification/notification";
import {
  ICollectionAddItemPayload,
  ICollectionDeleteItemPayload,
  ICollectionUpdateItemPayload,
  IUpdateResourceMeta
} from "../collection";
import {
  ADD_NOTIFICATION,
  BULK_ADD_NOTIFICATIONS,
  BULK_DELETE_NOTIFICATIONS,
  BULK_UPDATE_NOTIFICATIONS,
  DELETE_NOTIFICATION,
  UPDATE_NOTIFICATION
} from "./constants";

export interface IAddNotificationAction {
  type: ADD_NOTIFICATION;
  payload: ICollectionAddItemPayload<INotification>;
}

export function addNotificationRedux(
  notification: INotification
): IAddNotificationAction {
  return {
    type: ADD_NOTIFICATION,
    payload: {
      id: notification.customId,
      data: notification
    }
  };
}

export interface IUpdateNotificationAction {
  type: UPDATE_NOTIFICATION;
  payload: ICollectionUpdateItemPayload<INotification>;
  meta: IUpdateResourceMeta;
}

export function updateNotificationRedux(
  id: string,
  notification: Partial<INotification>,
  meta: IUpdateResourceMeta
): IUpdateNotificationAction {
  return {
    meta,
    type: UPDATE_NOTIFICATION,
    payload: {
      id,
      data: notification
    }
  };
}

export interface IDeleteNotificationAction {
  type: DELETE_NOTIFICATION;
  payload: ICollectionDeleteItemPayload;
}

export function deleteNotificationRedux(id: string): IDeleteNotificationAction {
  return {
    type: DELETE_NOTIFICATION,
    payload: {
      id
    }
  };
}

export interface IBulkAddNotificationsAction {
  type: BULK_ADD_NOTIFICATIONS;
  payload: Array<ICollectionAddItemPayload<INotification>>;
}

export function bulkAddNotificationsRedux(
  notifications: INotification[]
): IBulkAddNotificationsAction {
  return {
    type: BULK_ADD_NOTIFICATIONS,
    payload: notifications.map(notification => ({
      id: notification.customId,
      data: notification
    }))
  };
}

export interface IBulkUpdateNotificationsAction {
  type: BULK_UPDATE_NOTIFICATIONS;
  payload: Array<ICollectionUpdateItemPayload<INotification>>;
  meta: IUpdateResourceMeta;
}

export function bulkUpdateNotificationsRedux(
  notifications: Array<{ id: string; data: Partial<INotification> }>,
  meta: IUpdateResourceMeta
): IBulkUpdateNotificationsAction {
  return {
    meta,
    type: BULK_UPDATE_NOTIFICATIONS,
    payload: notifications
  };
}

export interface IBulkDeleteNotificationsAction {
  type: BULK_DELETE_NOTIFICATIONS;
  payload: ICollectionDeleteItemPayload[];
}

export function bulkDeleteNotificationsRedux(
  notifications: string[]
): IBulkDeleteNotificationsAction {
  return {
    type: BULK_DELETE_NOTIFICATIONS,
    payload: notifications.map(id => ({ id }))
  };
}

export type INotificationsAction =
  | IAddNotificationAction
  | IUpdateNotificationAction
  | IDeleteNotificationAction
  | IBulkAddNotificationsAction
  | IBulkUpdateNotificationsAction
  | IBulkDeleteNotificationsAction;
