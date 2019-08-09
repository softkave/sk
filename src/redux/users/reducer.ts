import { IUser } from "../../models/user/user";
import { makeReferenceCountedResourcesReducer } from "../referenceCounting";
import {
  BULK_ADD_USERS,
  BULK_DELETE_USERS,
  BULK_UPDATE_USERS
} from "./constants";

const reducer = makeReferenceCountedResourcesReducer<
  IUser,
  BULK_ADD_USERS,
  BULK_UPDATE_USERS,
  BULK_DELETE_USERS
>(BULK_ADD_USERS, BULK_UPDATE_USERS, BULK_DELETE_USERS);

export const usersReducer = reducer.reducer;

export type IUsersReduxState = typeof reducer.resourcesType;
