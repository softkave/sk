import { INotification } from "../../models/notification/notification";
import IView from "./view";

export const notificationsViewName = "notifications";

export interface INotificationsView extends IView {
  viewName: typeof notificationsViewName;
}

export function makeNotificationsView(): INotificationsView {
  return {
    viewName: notificationsViewName
  };
}

export const currentNotificationViewName = "current_notification";

export interface ICurrentNotificationView extends IView {
  viewName: typeof currentNotificationViewName;
  notificationID: string;
}

export function makeCurrentNotificationView(
  notification: INotification
): ICurrentNotificationView {
  return {
    viewName: currentNotificationViewName,
    notificationID: notification.customId
  };
}
