import { IBlock } from "../../models/block/block";
import {
    CollaborationRequestResponse,
    INotification,
} from "../../models/notification/notification";
import { IClient, IUser } from "../../models/user/user";
import auth from "../auth";
import query from "../query";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import {
    changePasswordMutation,
    changePasswordWithTokenMutation,
    forgotPasswordMutation,
    getUserDataQuery,
    getUserNotificationsQuery,
    markNotificationReadMutation,
    respondToCollaborationRequestMutation,
    updateClientMutation,
    updateUserMutation,
    userExistsQuery,
    userLoginMutation,
    userSignupMutation,
} from "./schema";

export type IUserLoginResult = GetEndpointResult<{
    user: IUser;
    client: IClient;
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
    const result = await query(
        null,
        userLoginMutation,
        props,
        "data.user.login"
    );

    return result;
}

export interface IUpdateUserAPIProps {
    user: {
        name?: string;
        notificationsLastCheckedAt?: Date;
        color?: string;
    };
}

async function updateUser(
    props: IUpdateUserAPIProps
): Promise<IEndpointResultBase> {
    return auth(null, updateUserMutation, props, "data.user.updateUser");
}

export interface IChangePasswordAPIProps {
    password: string;
    token: string;
}

async function changePassword(
    props: IChangePasswordAPIProps
): Promise<IUserLoginResult> {
    const result = await auth(
        null,
        changePasswordMutation,
        { password: props.password },
        "data.user.changePassword",
        props.token
    );

    return result;
}

export interface IForgotPasswordAPIProps {
    email: string;
}

async function forgotPassword(
    props: IForgotPasswordAPIProps
): Promise<IEndpointResultBase> {
    return query(
        null,
        forgotPasswordMutation,
        props,
        "data.user.forgotPassword"
    );
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

export interface IMarkNotificationReadAPIParams {
    notificationId: string;
    readAt: string;
}

async function markNotificationRead(
    props: IMarkNotificationReadAPIParams
): Promise<IEndpointResultBase> {
    return auth(
        null,
        markNotificationReadMutation,
        props,
        "data.user.markNotificationRead"
    );
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

export interface IRespondToCollaborationRequestAPIParams {
    requestId: string;
    response: CollaborationRequestResponse;
}

export type IRespondToCollaborationRequestAPIResult = GetEndpointResult<{
    block?: IBlock;
    respondedAt: string;
}>;

async function respondToCollaborationRequest(
    params: IRespondToCollaborationRequestAPIParams
): Promise<IRespondToCollaborationRequestAPIResult> {
    return auth(
        null,
        respondToCollaborationRequestMutation,
        params,
        "data.user.respondToCollaborationRequest"
    );
}

export interface IUpdateClientEndpointParams {
    data: {
        hasUserSeenNotificationsPermissionDialog?: boolean;
        muteChatNotifications?: boolean;
        isSubcribedToPushNotifications?: boolean;
        isLoggedIn?: boolean;
    };
}

export type IUpdateClientEndpointResult = GetEndpointResult<{
    client?: IClient;
}>;

async function updateClient(
    params: IUpdateClientEndpointParams
): Promise<IUpdateClientEndpointResult> {
    return auth(null, updateClientMutation, params, "data.user.updateClient");
}

export type IGetUserNotificationsAPIResult = GetEndpointResult<{
    requests: INotification[];
}>;

async function getUserNotifications(): Promise<IGetUserNotificationsAPIResult> {
    return auth(
        null,
        getUserNotificationsQuery,
        {},
        "data.user.getUserNotifications"
    );
}

export interface IGetUserDataAPIParams {
    token: string;
}

async function getUserData(
    props: IGetUserDataAPIParams
): Promise<IUserLoginResult> {
    return auth(
        null,
        getUserDataQuery,
        {},
        "data.user.getUserData",
        props.token
    );
}

export default class UserAPI {
    public static signup = signup;
    public static login = login;
    public static updateUser = updateUser;
    public static changePassword = changePassword;
    public static forgotPassword = forgotPassword;
    public static userExists = userExists;
    public static markNotificationRead = markNotificationRead;
    public static changePasswordWithToken = changePasswordWithToken;
    public static respondToCollaborationRequest = respondToCollaborationRequest;
    public static getUserNotifications = getUserNotifications;
    public static getUserData = getUserData;
    public static updateClient = updateClient;
}
