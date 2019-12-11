import { INotification } from "./notification";

export function findNotification(notifications: INotification[], id: string) {
  return notifications.find(notification => notification.customId === id);
}
