import { IUserRole } from "../../models/user/user";
import {
  IReferenceCountedResourceAddPayload,
  IReferenceCountedResourceDeletePayload,
  IReferenceCountedResourceUpdatePayload
} from "../referenceCounting";
import {
  ADD_ROLE,
  BULK_ADD_ROLES,
  BULK_DELETE_ROLES,
  BULK_UPDATE_ROLES,
  DELETE_ROLE,
  UPDATE_ROLE
} from "./constants";

export interface IAddRoleAction {
  type: ADD_ROLE;
  payload: IReferenceCountedResourceAddPayload<IUserRole>;
}

export function addRoleRedux(role: IUserRole): IAddRoleAction {
  return {
    type: ADD_ROLE,
    payload: {
      id: role.customId,
      data: role
    }
  };
}

export interface IUpdateRoleAction {
  type: UPDATE_ROLE;
  payload: IReferenceCountedResourceUpdatePayload<IUserRole>;
}

export function updateRoleRedux(
  id: string,
  role: IUserRole
): IUpdateRoleAction {
  return {
    type: UPDATE_ROLE,
    payload: {
      id,
      data: role
    }
  };
}

export interface IDeleteRoleAction {
  type: DELETE_ROLE;
  payload: IReferenceCountedResourceDeletePayload;
}

export function deleteRoleRedux(id: string): IDeleteRoleAction {
  return {
    type: DELETE_ROLE,
    payload: {
      id
    }
  };
}

export interface IBulkAddRolesAction {
  type: BULK_ADD_ROLES;
  payload: Array<IReferenceCountedResourceAddPayload<IUserRole>>;
}

export function bulkAddRolesRedux(roles: IUserRole[]): IBulkAddRolesAction {
  return {
    type: BULK_ADD_ROLES,
    payload: roles.map(role => ({
      id: role.customId,
      data: role
    }))
  };
}

export interface IBulkUpdateRolesAction {
  type: BULK_UPDATE_ROLES;
  payload: Array<IReferenceCountedResourceUpdatePayload<IUserRole>>;
}

export function bulkUpdateRolesRedux(
  roles: Array<{ id: string; data: Partial<IUserRole> }>
): IBulkUpdateRolesAction {
  return {
    type: BULK_UPDATE_ROLES,
    payload: roles
  };
}

export interface IBulkDeleteRolesAction {
  type: BULK_DELETE_ROLES;
  payload: IReferenceCountedResourceDeletePayload[];
}

export function bulkDeleteRolesRedux(roles: string[]): IBulkDeleteRolesAction {
  return {
    type: BULK_DELETE_ROLES,
    payload: roles.map(id => ({ id }))
  };
}

export type IRolesAction =
  | IAddRoleAction
  | IUpdateRoleAction
  | IDeleteRoleAction
  | IBulkAddRolesAction
  | IBulkUpdateRolesAction
  | IBulkDeleteRolesAction;
