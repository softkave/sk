import { IUserRole } from "../../models/user/user";
import {
  bulkAddReferenceCountedResources,
  bulkDeleteReferenceCountedResources,
  bulkUpdateReferenceCountedResources,
  IReferenceCountedNormalizedResources
} from "../referenceCounting";
import { IRolesAction } from "./actions";
import {
  ADD_ROLE,
  BULK_ADD_ROLES,
  BULK_DELETE_ROLES,
  BULK_UPDATE_ROLES,
  DELETE_ROLE,
  UPDATE_ROLE
} from "./constants";

// TODO: Remove unused node modules

export type IRolesState = IReferenceCountedNormalizedResources<IUserRole>;

export function rolesReducer(
  state: IRolesState = {},
  action: IRolesAction
): IRolesState {
  switch (action.type) {
    case ADD_ROLE: {
      return bulkAddReferenceCountedResources(state, [action.payload]);
    }

    case UPDATE_ROLE: {
      return bulkUpdateReferenceCountedResources(state, [action.payload]);
    }

    case DELETE_ROLE: {
      return bulkDeleteReferenceCountedResources(state, [action.payload]);
    }

    case BULK_ADD_ROLES: {
      return bulkAddReferenceCountedResources(state, action.payload);
    }

    case BULK_UPDATE_ROLES: {
      return bulkUpdateReferenceCountedResources(state, action.payload);
    }

    case BULK_DELETE_ROLES: {
      return bulkDeleteReferenceCountedResources(state, action.payload);
    }

    default:
      return state;
  }
}
