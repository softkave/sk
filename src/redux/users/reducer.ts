import { IUser } from "../../models/user/user";
import { CLEAR_STATE } from "../constants";
import {
  bulkAddReferenceCountedResources,
  bulkDeleteReferenceCountedResources,
  bulkUpdateReferenceCountedResources,
  IReferenceCountedNormalizedResources
} from "../referenceCounting";
import { IUsersAction } from "./actions";
import {
  ADD_USER,
  BULK_ADD_USERS,
  BULK_DELETE_USERS,
  BULK_UPDATE_USERS,
  DELETE_USER,
  UPDATE_USER
} from "./constants";

// TODO: Remove unused node modules

export type IUsersState = IReferenceCountedNormalizedResources<IUser>;

export function usersReducer(
  state: IUsersState = {},
  action: IUsersAction
): IUsersState {
  switch (action.type) {
    case ADD_USER: {
      return bulkAddReferenceCountedResources(state, [action.payload]);
    }

    case UPDATE_USER: {
      return bulkUpdateReferenceCountedResources(
        state,
        [action.payload],
        action.meta
      );
    }

    case DELETE_USER: {
      return bulkDeleteReferenceCountedResources(state, [action.payload]);
    }

    case BULK_ADD_USERS: {
      return bulkAddReferenceCountedResources(state, action.payload);
    }

    case BULK_UPDATE_USERS: {
      return bulkUpdateReferenceCountedResources(
        state,
        action.payload,
        action.meta
      );
    }

    case BULK_DELETE_USERS: {
      return bulkDeleteReferenceCountedResources(state, action.payload);
    }

    case CLEAR_STATE: {
      return {};
    }

    default:
      return state;
  }
}
