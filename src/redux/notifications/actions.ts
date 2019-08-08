import { INotification } from "../../models/notification/notification";
import { makeReferenceCountedResourceActions } from "../referenceCounting";
import {
  BULK_ADD_NOTIFICATIONS,
  BULK_DELETE_NOTIFICATIONS,
  BULK_UPDATE_NOTIFICATIONS
} from "./constants";

const actions = makeReferenceCountedResourceActions<
  INotification,
  BULK_ADD_NOTIFICATIONS,
  BULK_UPDATE_NOTIFICATIONS,
  BULK_DELETE_NOTIFICATIONS
>(BULK_ADD_NOTIFICATIONS, BULK_UPDATE_NOTIFICATIONS, BULK_DELETE_NOTIFICATIONS);

export const addNotification = actions.addResource;
export const updateNotification = actions.updateResource;
export const deleteNotification = actions.deleteResource;
export const bulkAddNotifications = actions.bulkAddResources;
export const bulkUpdateNotifications = actions.bulkUpdateResources;
export const bulkDeleteNotifications = actions.bulkDeleteResources;

export type INotificationsActions = typeof actions.actionTypes;
