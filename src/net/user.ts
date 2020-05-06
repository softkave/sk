import { INotification } from "../models/notification/notification";
import { IUser } from "../models/user/user";
import { getDataFromObject } from "../utils/object";
import auth from "./auth";
import query from "./query";
import {
  changePasswordMutation,
  changePasswordWithTokenMutation,
  forgotPasswordMutation,
  getCollaborationRequestsQuery,
  getSessionDetailsQuery,
  getUserDataQuery,
  respondToCollaborationRequestMutation,
  updateCollaborationRequestMutation,
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
  const updateUserFields = ["name", "lastNotificationCheckTime"];

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

// TODO: define data's type
export function updateCollaborationRequest(request: INotification, data: any) {
  const updateRequestFields = ["readAt"];

  return auth(
    null,
    updateCollaborationRequestMutation,
    {
      customId: request.customId,
      data: getDataFromObject(data, updateRequestFields),
    },
    "data.user.updateCollaborationRequest"
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
    { response, customId: request.customId },
    "data.user.respondToCollaborationRequest"
  );
}

export function getCollaborationRequests() {
  return auth(
    null,
    getCollaborationRequestsQuery,
    {},
    "data.user.getCollaborationRequests"
  );
}

export function getSessionDetails(token: string) {
  return auth(
    null,
    getSessionDetailsQuery,
    {},
    "data.user.getSessionDetails",
    token
  );
}

export function getUserData(token: string) {
  return auth(null, getUserDataQuery, {}, "data.user.getUserData", token);
}
