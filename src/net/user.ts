import { getDataFromObject } from "../utils/object";
import { getItem, removeItem, setItem } from "../utils/storage";
import auth from "./auth";
import query from "./query";
import {
  changePasswordMutation,
  changePasswordWithTokenMutation,
  forgotPasswordMutation,
  getCollaborationRequestsQuery,
  getUserDataQuery,
  respondToCollaborationRequestMutation,
  updateCollaborationRequestMutation,
  updateUserMutation,
  userExistsQuery,
  userLoginMutation,
  userSignupMutation
} from "./schema/user";

const tokenStorageName = "t";

// TODO: Define types for the parameters

export async function signup({ user }) {
  const userFields = ["name", "password", "email", "color"];

  const result = await query(
    null,
    userSignupMutation,
    { user: getDataFromObject(user, userFields) },
    "data.user.signup"
  );

  setItem(tokenStorageName, result.token, "local");

  return result;
}

export async function login({ email, password }) {
  const result = await query(
    null,
    userLoginMutation,
    { email, password },
    "data.user.login"
  );

  return result;
}

export function logout() {
  removeItem(tokenStorageName, "local");
}

export function updateUser({ user }) {
  const updateUserFields = ["name", "lastNotificationCheckTime"];

  return auth(
    null,
    updateUserMutation,
    { user: getDataFromObject(user, updateUserFields) },
    "data.user.updateUser"
  );
}

export async function changePassword({ password, token }) {
  const result = await auth(
    null,
    changePasswordMutation,
    { password },
    "data.user.changePassword",
    token
  );

  const prevToken = getItem(tokenStorageName);

  if (prevToken) {
    setItem(tokenStorageName, result.token, "local");
  }

  return result;
}

export function forgotPassword({ email }) {
  return query(
    null,
    forgotPasswordMutation,
    { email },
    "data.user.forgotPassword"
  );
}

export function userExists({ email }) {
  return query(null, userExistsQuery, { email }, "data.user.userExists");
}

export function updateCollaborationRequest({ request, data }) {
  const updateRequestFields = ["readAt"];

  return auth(
    null,
    updateCollaborationRequestMutation,
    {
      customId: request.customId,
      data: getDataFromObject(data, updateRequestFields)
    },
    "data.user.updateCollaborationRequest"
  );
}

export function changePasswordWithToken({ password, token }) {
  return auth(
    null,
    changePasswordWithTokenMutation,
    { password },
    "data.user.changePasswordWithToken",
    token
  );
}

export function respondToCollaborationRequest({ request, response }) {
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

export function getUserData(token) {
  return auth(null, getUserDataQuery, {}, "data.user.getUserData", token);
}

export async function getSavedUserData() {
  const userToken = getItem(tokenStorageName);

  if (userToken) {
    const result = await getUserData(userToken);

    if (result && result.errors) {
      throw result.errors;
    }

    const { user, token } = result;
    setItem(tokenStorageName, token);
    return { user, token };
  }
}
