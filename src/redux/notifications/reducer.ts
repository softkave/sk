import { INotification } from "../../models/notification/notification";
import { makeReferenceCountedResourcesReducer } from "../referenceCounting";
import {
  BULK_ADD_NOTIFICATIONS,
  BULK_DELETE_NOTIFICATIONS,
  BULK_UPDATE_NOTIFICATIONS
} from "./constants";

const reducer = makeReferenceCountedResourcesReducer<
  INotification,
  BULK_ADD_NOTIFICATIONS,
  BULK_UPDATE_NOTIFICATIONS,
  BULK_DELETE_NOTIFICATIONS
>(BULK_ADD_NOTIFICATIONS, BULK_UPDATE_NOTIFICATIONS, BULK_DELETE_NOTIFICATIONS);

export const notificationsReducer = reducer.reducer;

export type INotificationsReduxState = typeof reducer.resourcesType;
