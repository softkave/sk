import { IUser, IPersistedClient } from "../../models/user/user";
import auth from "../auth";
import query from "../query";
import {
  GetEndpointResult,
  GetEndpointResultError,
  IEndpointResultBase,
} from "../types";
import {
  changePasswordMutation,
  changePasswordWithTokenMutation,
  forgotPasswordMutation,
  getUserDataQuery,
  updateClientMutation,
  updateUserMutation,
  userExistsQuery,
  userLoginMutation,
  userSignupMutation,
} from "./schema";

export type IUserLoginResult = GetEndpointResult<{
  user: IUser;
  client: IPersistedClient;
  token: string;
}>;

export interface ISignupAPIProps {
  user: {
    name: string;
    password: string;
    email: string;
    color: string;
  };
}

async function signup(props: ISignupAPIProps): Promise<IUserLoginResult> {
  const result = await query(
    null,
    userSignupMutation,
    props,
    "data.user.signup"
  );

  return result;
}

export interface ILoginAPIProps {
  email: string;
  password: string;
}

async function login(props: ILoginAPIProps): Promise<IUserLoginResult> {
  const result = await query(null, userLoginMutation, props, "data.user.login");

  return result;
}

export interface IUpdateUserAPIProps {
  data: {
    name?: string;
    notificationsLastCheckedAt?: Date;
    color?: string;
    email?: string;
  };
}

export type IUpdateUserEndpointErrors =
  GetEndpointResultError<IUpdateUserAPIProps>;

async function updateUser(
  props: IUpdateUserAPIProps
): Promise<IUserLoginResult> {
  return auth(null, updateUserMutation, props, "data.user.updateUser");
}

export interface IChangePasswordAPIProps {
  currentPassword: string;
  password: string;
}

async function changePassword(
  props: IChangePasswordAPIProps
): Promise<IUserLoginResult> {
  const result = await auth(
    null,
    changePasswordMutation,
    { password: props.password, currentPassword: props.currentPassword },
    "data.user.changePassword"
  );

  return result;
}

export interface IForgotPasswordAPIProps {
  email: string;
}

async function forgotPassword(
  props: IForgotPasswordAPIProps
): Promise<IEndpointResultBase> {
  return query(null, forgotPasswordMutation, props, "data.user.forgotPassword");
}

export interface IUserExistsAPIParams {
  email: string;
}

export type IUserExistsAPIResult = GetEndpointResult<{
  exists: boolean;
}>;

async function userExists(
  props: IUserExistsAPIParams
): Promise<IUserExistsAPIResult> {
  return query(null, userExistsQuery, props, "data.user.userExists");
}

export interface IChangePasswordWithTokenAPIParams {
  password: string;
  token: string;
}

async function changePasswordWithToken(
  props: IChangePasswordWithTokenAPIParams
): Promise<IUserLoginResult> {
  return auth(
    null,
    changePasswordWithTokenMutation,
    { password: props.password },
    "data.user.changePasswordWithToken",
    props.token
  );
}

export interface IUpdateClientEndpointParams {
  data: Omit<IPersistedClient, "clientId">;
}

export type IUpdateClientEndpointResult = GetEndpointResult<{
  client: IPersistedClient;
}>;

export type IUpdateClientEndpointErrors =
  GetEndpointResultError<IUpdateClientEndpointParams>;

async function updateClient(
  params: IUpdateClientEndpointParams
): Promise<IUpdateClientEndpointResult> {
  return auth(null, updateClientMutation, params, "data.client.updateClient");
}

export interface IGetUserDataAPIParams {
  token: string;
}

async function getUserData(
  props: IGetUserDataAPIParams
): Promise<IUserLoginResult> {
  return auth(null, getUserDataQuery, {}, "data.user.getUserData", props.token);
}

export default class UserAPI {
  public static signup = signup;
  public static login = login;
  public static updateUser = updateUser;
  public static changePassword = changePassword;
  public static forgotPassword = forgotPassword;
  public static userExists = userExists;
  public static changePasswordWithToken = changePasswordWithToken;
  public static getUserData = getUserData;
  public static updateClient = updateClient;
}
