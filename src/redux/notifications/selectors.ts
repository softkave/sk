import { INotification } from "../../models/notification/notification";
import { IAppState } from "../types";

export function getNotification(state: IAppState, id: string) {
  return state.notifications[id];
}

export function getNotifications(state: IAppState, ids: string[]) {
  return ids.reduce((notifications, id) => {
    if (state.notifications[id]) {
      notifications.push(state.notifications[id]);
    }

    return notifications;
  }, [] as INotification[]);
}

export default class NotificationSelectors {
  public static getNotification = getNotification;
  public static getNotifications = getNotifications;
}
