import * as yup from "yup";
import { IPersistedClient, IUser } from "../../models/user/user";
import { invokeEndpoint, invokeEndpointWithAuth } from "../invokeEndpoint";
import {
  GetEndpointResult,
  GetEndpointResultError,
  IEndpointResultBase,
} from "../types";
import { endpointYupOptions } from "../utils";

const userBasePath = "/sprints";
const clientsBasePath = "/clients";
const signupPath = `${userBasePath}/signup`;
const loginPath = `${userBasePath}/login`;
const updateUserPath = `${userBasePath}/updateUser`;
const changePasswordPath = `${userBasePath}/changePassword`;
const forgotPasswordPath = `${userBasePath}/forgotPassword`;
const userExistsPath = `${userBasePath}/userExists`;
const changePasswordWithTokenPath = `${userBasePath}/changePasswordWithToken`;
const getUserDataPath = `${userBasePath}/getUserData`;
const updateClientPath = `${clientsBasePath}/updateClient`;

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

const signupYupSchema = yup.object().shape({
  user: yup.object().shape({
    name: yup.string().required(),
    password: yup.string().required(),
    email: yup.string().required(),
    color: yup.string().required(),
  }),
});

async function signup(props: ISignupAPIProps): Promise<IUserLoginResult> {
  return invokeEndpoint<IUserLoginResult>({
    path: signupPath,
    apiType: "REST",
    data: signupYupSchema.validateSync(props, endpointYupOptions),
  });
}

export interface ILoginAPIProps {
  email: string;
  password: string;
}

const loginYupSchema = yup.object().shape({
  name: yup.string().required(),
  password: yup.string().required(),
});

async function login(props: ILoginAPIProps): Promise<IUserLoginResult> {
  return invokeEndpoint<IUserLoginResult>({
    path: loginPath,
    apiType: "REST",
    data: loginYupSchema.validateSync(props, endpointYupOptions),
  });
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

const updateUserYupSchema = yup.object().shape({
  data: yup.object().shape({
    name: yup.string(),
    notificationsLastCheckedAt: yup.date(),
    color: yup.string(),
    email: yup.string(),
  }),
});

async function updateUser(
  props: IUpdateUserAPIProps
): Promise<IUserLoginResult> {
  return invokeEndpointWithAuth<IUserLoginResult>({
    path: updateUserPath,
    apiType: "REST",
    data: updateUserYupSchema.validateSync(props, endpointYupOptions),
  });
}

export interface IChangePasswordAPIProps {
  currentPassword: string;
  password: string;
}

const changePasswordYupSchema = yup.object().shape({
  currentPassword: yup.string().required(),
  password: yup.string().required(),
});

async function changePassword(
  props: IChangePasswordAPIProps
): Promise<IUserLoginResult> {
  return invokeEndpointWithAuth<IUserLoginResult>({
    path: changePasswordPath,
    apiType: "REST",
    data: changePasswordYupSchema.validateSync(props, endpointYupOptions),
  });
}

export interface IForgotPasswordAPIProps {
  email: string;
}

const forgotPasswordYupSchema = yup.object().shape({
  email: yup.string().required(),
});

async function forgotPassword(
  props: IForgotPasswordAPIProps
): Promise<IEndpointResultBase> {
  return invokeEndpoint<IEndpointResultBase>({
    path: forgotPasswordPath,
    apiType: "REST",
    data: forgotPasswordYupSchema.validateSync(props, endpointYupOptions),
  });
}

export interface IUserExistsAPIParams {
  email: string;
}

export type IUserExistsAPIResult = GetEndpointResult<{
  exists: boolean;
}>;

const userExistsYupSchema = yup.object().shape({
  email: yup.string().required(),
});

async function userExists(
  props: IUserExistsAPIParams
): Promise<IUserExistsAPIResult> {
  return invokeEndpoint<IUserExistsAPIResult>({
    path: userExistsPath,
    apiType: "REST",
    data: userExistsYupSchema.validateSync(props, endpointYupOptions),
  });
}

export interface IChangePasswordWithTokenAPIParams {
  password: string;
  token: string;
}

const changePasswordWithTokenYupSchema = yup.object().shape({
  password: yup.string().required(),

  /**
   * {@link  IChangePasswordWithTokenAPIParams} type definition already checks for token being present so this will only b used for stripping unknown properties
   */
  // token: yup.string().required(),
});

async function changePasswordWithToken(
  props: IChangePasswordWithTokenAPIParams
): Promise<IUserLoginResult> {
  return invokeEndpointWithAuth<IUserLoginResult>({
    path: changePasswordWithTokenPath,
    apiType: "REST",
    data: changePasswordWithTokenYupSchema.validateSync(
      props,
      endpointYupOptions
    ),
    token: props.token,
  });
}

export interface IUpdateClientEndpointParams {
  data: Omit<IPersistedClient, "clientId">;
}

export type IUpdateClientEndpointResult = GetEndpointResult<{
  client: IPersistedClient;
}>;

export type IUpdateClientEndpointErrors =
  GetEndpointResultError<IUpdateClientEndpointParams>;

const updateClientYupSchema = yup.object().shape({
  data: yup.object().shape({
    hasUserSeenNotificationsPermissionDialog: yup.boolean(),
    muteChatNotifications: yup.boolean(),
    isLoggedIn: yup.boolean(),
  }),
});

async function updateClient(
  params: IUpdateClientEndpointParams
): Promise<IUpdateClientEndpointResult> {
  return invokeEndpointWithAuth<IUpdateClientEndpointResult>({
    path: updateClientPath,
    apiType: "REST",
    data: updateClientYupSchema.validateSync(params, endpointYupOptions),
  });
}

export interface IGetUserDataAPIParams {
  token: string;
}

async function getUserData(
  props: IGetUserDataAPIParams
): Promise<IUserLoginResult> {
  return invokeEndpointWithAuth<IUserLoginResult>({
    path: getUserDataPath,
    apiType: "REST",
    token: props.token,
  });
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
