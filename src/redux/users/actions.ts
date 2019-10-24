import { IUser } from "../../models/user/user";
import {
  ICollectionAddItemPayload,
  ICollectionDeleteItemPayload,
  ICollectionUpdateItemPayload,
  IUpdateResourceMeta
} from "../collection";
import {
  ADD_USER,
  BULK_ADD_USERS,
  BULK_DELETE_USERS,
  BULK_UPDATE_USERS,
  DELETE_USER,
  UPDATE_USER
} from "./constants";

export interface IAddUserAction {
  type: ADD_USER;
  payload: ICollectionAddItemPayload<IUser>;
}

export function addUserRedux(user: IUser): IAddUserAction {
  return {
    type: ADD_USER,
    payload: {
      id: user.customId,
      data: user
    }
  };
}

export interface IUpdateUserAction {
  type: UPDATE_USER;
  payload: ICollectionUpdateItemPayload<IUser>;
  meta: IUpdateResourceMeta;
}

export function updateUserRedux(
  id: string,
  user: Partial<IUser>,
  meta: IUpdateResourceMeta
): IUpdateUserAction {
  return {
    meta,
    type: UPDATE_USER,
    payload: {
      id,
      data: user
    }
  };
}

export interface IDeleteUserAction {
  type: DELETE_USER;
  payload: ICollectionDeleteItemPayload;
}

export function deleteUserRedux(id: string): IDeleteUserAction {
  return {
    type: DELETE_USER,
    payload: {
      id
    }
  };
}

export interface IBulkAddUsersAction {
  type: BULK_ADD_USERS;
  payload: Array<ICollectionAddItemPayload<IUser>>;
}

export function bulkAddUsersRedux(users: IUser[]): IBulkAddUsersAction {
  return {
    type: BULK_ADD_USERS,
    payload: users.map(user => ({
      id: user.customId,
      data: user
    }))
  };
}

export interface IBulkUpdateUsersAction {
  type: BULK_UPDATE_USERS;
  payload: Array<ICollectionUpdateItemPayload<IUser>>;
  meta: IUpdateResourceMeta;
}

export function bulkUpdateUsersRedux(
  users: Array<{ id: string; data: Partial<IUser> }>,
  meta: IUpdateResourceMeta
): IBulkUpdateUsersAction {
  return {
    meta,
    type: BULK_UPDATE_USERS,
    payload: users
  };
}

export interface IBulkDeleteUsersAction {
  type: BULK_DELETE_USERS;
  payload: ICollectionDeleteItemPayload[];
}

export function bulkDeleteUsersRedux(users: string[]): IBulkDeleteUsersAction {
  return {
    type: BULK_DELETE_USERS,
    payload: users.map(id => ({ id }))
  };
}

export type IUsersAction =
  | IAddUserAction
  | IUpdateUserAction
  | IDeleteUserAction
  | IBulkAddUsersAction
  | IBulkUpdateUsersAction
  | IBulkDeleteUsersAction;
