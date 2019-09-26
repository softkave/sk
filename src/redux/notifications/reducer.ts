import { INotification } from "../../models/notification/notification";
import {
  bulkAddCollectionItems,
  bulkDeleteCollectionItems,
  bulkUpdateCollectionItems,
  ICollectionMap
} from "../collection";
import { ILogoutUserAction } from "../session/actions";
import { LOGOUT_USER } from "../session/constants";
import { INotificationsAction } from "./actions";
import {
  ADD_NOTIFICATION,
  BULK_ADD_NOTIFICATIONS,
  BULK_DELETE_NOTIFICATIONS,
  BULK_UPDATE_NOTIFICATIONS,
  DELETE_NOTIFICATION,
  UPDATE_NOTIFICATION
} from "./constants";

// TODO: Remove unused node modules

export type INotificationsState = ICollectionMap<INotification>;

export function notificationsReducer(
  state: INotificationsState = {},
  action: INotificationsAction | ILogoutUserAction
): INotificationsState {
  switch (action.type) {
    case ADD_NOTIFICATION: {
      return bulkAddCollectionItems(state, [action.payload]);
    }

    case UPDATE_NOTIFICATION: {
      return bulkUpdateCollectionItems(state, [action.payload], action.meta);
    }

    case DELETE_NOTIFICATION: {
      return bulkDeleteCollectionItems(state, [action.payload]);
    }

    case BULK_ADD_NOTIFICATIONS: {
      return bulkAddCollectionItems(state, action.payload);
    }

    case BULK_UPDATE_NOTIFICATIONS: {
      return bulkUpdateCollectionItems(state, action.payload, action.meta);
    }

    case BULK_DELETE_NOTIFICATIONS: {
      return bulkDeleteCollectionItems(state, action.payload);
    }

    case LOGOUT_USER: {
      return {};
    }

    default:
      return state;
  }
}
