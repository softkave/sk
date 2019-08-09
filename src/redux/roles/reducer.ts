import { IUserRole } from "../../models/user/user";
import { makeReferenceCountedResourcesReducer } from "../referenceCounting";
import {
  BULK_ADD_ROLES,
  BULK_DELETE_ROLES,
  BULK_UPDATE_ROLES
} from "./constants";

const reducer = makeReferenceCountedResourcesReducer<
  IUserRole,
  BULK_ADD_ROLES,
  BULK_UPDATE_ROLES,
  BULK_DELETE_ROLES
>(BULK_ADD_ROLES, BULK_UPDATE_ROLES, BULK_DELETE_ROLES);

export const rolesReducer = reducer.reducer;

export type IRolesReduxState = typeof reducer.resourcesType;
