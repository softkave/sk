import { IUserRole } from "../../models/user/user";
import { IReferenceCountedResource } from "../referenceCounting";
import {
  BULK_ADD_ROLES,
  BULK_DELETE_ROLES,
  BULK_UPDATE_ROLES
} from "./constants";

export interface IUpdateRoleParams {
  id: string;
  role: IUserRole;
}

export interface IReduxRole extends IUserRole, IReferenceCountedResource {}

export function addRole(role: IReduxRole): IBulkAddRolesAction {
  return bulkAddRoles([role]);
}

export function updateRole(role: IUpdateRoleParams): IBulkUpdateRolesAction {
  return bulkUpdateRoles([role]);
}

export function deleteRole(role: string): IBulkDeleteRolesAction {
  return bulkDeleteRoles([role]);
}

export interface IBulkAddRolesAction {
  type: BULK_ADD_ROLES;
  payload: {
    roles: IUserRole[];
  };
}

export function bulkAddRoles(roles: IUserRole[]): IBulkAddRolesAction {
  return {
    type: BULK_ADD_ROLES,
    payload: {
      roles
    }
  };
}

export interface IBulkUpdateRolesAction {
  type: BULK_UPDATE_ROLES;
  payload: {
    roles: IUpdateRoleParams[];
  };
}

export function bulkUpdateRoles(
  roles: IUpdateRoleParams[]
): IBulkUpdateRolesAction {
  return {
    type: BULK_UPDATE_ROLES,
    payload: {
      roles
    }
  };
}

export interface IBulkDeleteRolesAction {
  type: BULK_DELETE_ROLES;
  payload: {
    roles: string[];
  };
}

export function bulkDeleteRoles(roles: string[]): IBulkDeleteRolesAction {
  return {
    type: BULK_DELETE_ROLES,
    payload: {
      roles
    }
  };
}
