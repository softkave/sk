import { IUser } from "../../models/user/user";
import { makeReferenceCountedResourceActions } from "../referenceCounting";
import {
  BULK_ADD_USERS,
  BULK_DELETE_USERS,
  BULK_UPDATE_USERS
} from "./constants";

const actions = makeReferenceCountedResourceActions<
  IUser,
  BULK_ADD_USERS,
  BULK_UPDATE_USERS,
  BULK_DELETE_USERS
>(BULK_ADD_USERS, BULK_UPDATE_USERS, BULK_DELETE_USERS);

export const addUser = actions.addResource;
export const updateUser = actions.updateResource;
export const deleteUser = actions.deleteResource;
export const bulkAddUsers = actions.bulkAddResources;
export const bulkUpdateUsers = actions.bulkUpdateResources;
export const bulkDeleteUsers = actions.bulkDeleteResources;

export type IUsersActions = typeof actions.actionTypes;
