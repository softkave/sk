import { IUser } from "../../models/user/user";
import { IReferenceCountedResource } from "../referenceCounting";
import {
  BULK_ADD_USERS,
  BULK_DELETE_USERS,
  BULK_UPDATE_USERS
} from "./constants";

export interface IUpdateUserParams {
  id: string;
  user: IUser;
}

export interface IReduxUser extends IUser, IReferenceCountedResource {}

export function addUser(user: IReduxUser): IBulkAddUsersAction {
  return bulkAddUsers([user]);
}

export function updateUser(user: IUpdateUserParams): IBulkUpdateUsersAction {
  return bulkUpdateUsers([user]);
}

export function deleteUser(user: string): IBulkDeleteUsersAction {
  return bulkDeleteUsers([user]);
}

export interface IBulkAddUsersAction {
  type: BULK_ADD_USERS;
  payload: {
    users: IUser[];
  };
}

export function bulkAddUsers(users: IUser[]): IBulkAddUsersAction {
  return {
    type: BULK_ADD_USERS,
    payload: {
      users
    }
  };
}

export interface IBulkUpdateUsersAction {
  type: BULK_UPDATE_USERS;
  payload: {
    users: IUpdateUserParams[];
  };
}

export function bulkUpdateUsers(
  users: IUpdateUserParams[]
): IBulkUpdateUsersAction {
  return {
    type: BULK_UPDATE_USERS,
    payload: {
      users
    }
  };
}

export interface IBulkDeleteUsersAction {
  type: BULK_DELETE_USERS;
  payload: {
    users: string[];
  };
}

export function bulkDeleteUsers(users: string[]): IBulkDeleteUsersAction {
  return {
    type: BULK_DELETE_USERS,
    payload: {
      users
    }
  };
}
