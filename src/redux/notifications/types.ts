import { INotification } from "../../models/notification/notification";

export interface INotificationsState {
  [key: string]: INotification;
}
