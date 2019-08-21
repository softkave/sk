import { INotification } from "../../models/notification/notification";
import { CLEAR_STATE } from "../constants";
import {
  bulkAddReferenceCountedResources,
  bulkDeleteReferenceCountedResources,
  bulkUpdateReferenceCountedResources,
  IReferenceCountedNormalizedResources
} from "../referenceCounting";
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

export type INotificationsState = IReferenceCountedNormalizedResources<
  INotification
>;

export function notificationsReducer(
  state: INotificationsState = {},
  action: INotificationsAction
): INotificationsState {
  switch (action.type) {
    case ADD_NOTIFICATION: {
      return bulkAddReferenceCountedResources(state, [action.payload]);
    }

    case UPDATE_NOTIFICATION: {
      return bulkUpdateReferenceCountedResources(state, [action.payload]);
    }

    case DELETE_NOTIFICATION: {
      return bulkDeleteReferenceCountedResources(state, [action.payload]);
    }

    case BULK_ADD_NOTIFICATIONS: {
      return bulkAddReferenceCountedResources(state, action.payload);
    }

    case BULK_UPDATE_NOTIFICATIONS: {
      return bulkUpdateReferenceCountedResources(state, action.payload);
    }

    case BULK_DELETE_NOTIFICATIONS: {
      return bulkDeleteReferenceCountedResources(state, action.payload);
    }

    case CLEAR_STATE: {
      return {};
    }

    default:
      return state;
  }
}
