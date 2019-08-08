import { IUserRole } from "../../models/user/user";
import { makeReferenceCountedResourceActions } from "../referenceCounting";
import {
  BULK_ADD_ROLES,
  BULK_DELETE_ROLES,
  BULK_UPDATE_ROLES
} from "./constants";

const actions = makeReferenceCountedResourceActions<
  IUserRole,
  BULK_ADD_ROLES,
  BULK_UPDATE_ROLES,
  BULK_DELETE_ROLES
>(BULK_ADD_ROLES, BULK_UPDATE_ROLES, BULK_DELETE_ROLES);

export const addRole = actions.addResource;
export const updateRole = actions.updateResource;
export const deleteRole = actions.deleteResource;
export const bulkAddRoles = actions.bulkAddResources;
export const bulkUpdateRoles = actions.bulkUpdateResources;
export const bulkDeleteRoles = actions.bulkDeleteResources;

export type IRolesActions = typeof actions.actionTypes;
