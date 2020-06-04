import { getCollectionItemsAsArray } from "../collection";
import { IAppState } from "../store";

export function getNotification(state: IAppState, id?: string) {
  if (id) {
    const notifications = getCollectionItemsAsArray(state.notifications, [id]);
    return notifications[0];
  }
}

export function getNotificationRequired(state: IAppState, id: string) {
  const notification = getNotification(state, id);

  if (!notification) {
    // TODO: Change all errors to either operation errors, or create error types from Error
    // with name changed to error type, that provides a standard customizable ( ${id} does not... ) error message
    throw new Error("Notification does not exist");
  }

  return notification;
}

export function getNotificationsAsArray(state: IAppState, ids: string[]) {
  return getCollectionItemsAsArray(state.notifications, ids);
}
