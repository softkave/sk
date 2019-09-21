import { IUser } from "../../models/user/user";
import {
  bulkAddCollectionItems,
  bulkDeleteCollectionItems,
  bulkUpdateCollectionItems,
  ICollectionMap
} from "../collection";
import { CLEAR_STATE } from "../state/constants";
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

export type IUsersState = ICollectionMap<IUser>;

export function usersReducer(
  state: IUsersState = {},
  action: IUsersAction
): IUsersState {
  switch (action.type) {
    case ADD_USER: {
      return bulkAddCollectionItems(state, [action.payload]);
    }

    case UPDATE_USER: {
      return bulkUpdateCollectionItems(state, [action.payload], action.meta);
    }

    case DELETE_USER: {
      return bulkDeleteCollectionItems(state, [action.payload]);
    }

    case BULK_ADD_USERS: {
      return bulkAddCollectionItems(state, action.payload);
    }

    case BULK_UPDATE_USERS: {
      return bulkUpdateCollectionItems(state, action.payload, action.meta);
    }

    case BULK_DELETE_USERS: {
      return bulkDeleteCollectionItems(state, action.payload);
    }

    case CLEAR_STATE: {
      return {};
    }

    default:
      return state;
  }
}
