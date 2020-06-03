import { INotification } from "../models/notification/notification";
import { IUser } from "../models/user/user";
import { getDataFromObject } from "../utils/object";
import auth from "./auth";
import query from "./query";
import {
  changePasswordMutation,
  changePasswordWithTokenMutation,
  forgotPasswordMutation,
  getUserDataQuery,
  getUserNotificationsQuery,
  markNotificationReadMutation,
  respondToCollaborationRequestMutation,
  updateUserMutation,
  userExistsQuery,
  userLoginMutation,
  userSignupMutation,
} from "./schema/user";

// TODO: Define types for the parameters

export interface ISignupEnpointProps {
  name: string;
  password: string;
  email: string;
  color: string;
}

export async function signup(user: ISignupEnpointProps) {
  const userFields = ["name", "password", "email", "color"];
  const result = await query(
    null,
    userSignupMutation,
    { user: getDataFromObject(user, userFields) },
    "data.user.signup"
  );

  return result;
}

export async function login(email: string, password: string) {
  const result = await query(
    null,
    userLoginMutation,
    { email, password },
    "data.user.login"
  );

  return result;
}

export function updateUser(user: IUser) {
  const updateUserFields = ["name", "notificationsLastCheckedAt", "color"];
  return auth(
    null,
    updateUserMutation,
    { user: getDataFromObject(user, updateUserFields) },
    "data.user.updateUser"
  );
}

export async function changePassword(password: string, token: string) {
  const result = await auth(
    null,
    changePasswordMutation,
    { password },
    "data.user.changePassword",
    token
  );

  return result;
}

export function forgotPassword(email: string) {
  return query(
    null,
    forgotPasswordMutation,
    { email },
    "data.user.forgotPassword"
  );
}

export function userExists(email: string) {
  return query(null, userExistsQuery, { email }, "data.user.userExists");
}

export function markNotificationRead(
  notification: INotification,
  readAt: string
) {
  return auth(
    null,
    markNotificationReadMutation,
    {
      notificationId: notification.customId,
      readAt,
    },
    "data.user.markNotificationRead"
  );
}

export function changePasswordWithToken(password: string, token: string) {
  return auth(
    null,
    changePasswordWithTokenMutation,
    { password },
    "data.user.changePasswordWithToken",
    token
  );
}

// TODO: define response's type
export function respondToCollaborationRequest(
  request: INotification,
  response: any
) {
  return auth(
    null,
    respondToCollaborationRequestMutation,
    { response, requestId: request.customId },
    "data.user.respondToCollaborationRequest"
  );
}

export function getUserNotifications() {
  return auth(
    null,
    getUserNotificationsQuery,
    {},
    "data.user.getUserNotifications"
  );
}

export function getUserData(token: string) {
  return auth(null, getUserDataQuery, {}, "data.user.getUserData", token);
}
