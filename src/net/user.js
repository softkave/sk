import {
  userSignupMutation,
  userLoginMutation,
  updateUserMutation,
  changePasswordMutation,
  forgotPasswordMutation,
  userExistsQuery,
  updateCollaborationRequestMutation,
  changePasswordWithTokenMutation,
  respondToCollaborationRequestMutation,
  getCollaborationRequestsQuery,
  getUserDataQuery
} from "./schema/user";
import query from "./query";
import auth from "./auth";
import { getDataFromObj } from "../utils/object";
import { setItem, getItem, removeItem } from "../utils/storage";

const tokenStorageName = "t";
const userStorageName = "user";

export async function signup(user) {
  const userFields = ["name", "password", "email"];

  let result = await query(
    null,
    userSignupMutation,
    { user: getDataFromObj(user, userFields) },
    "data.user.signup"
  );

  setItem(tokenStorageName, result.token, "local");

  return result;
}

export async function login(user) {
  let result = await query(
    null,
    userLoginMutation,
    { email: user.email, password: user.password },
    "data.user.login"
  );

  console.log(result);
  const prevToken = getItem(tokenStorageName);

  if (user.remember || prevToken) {
    setItem(tokenStorageName, result.token, "local");
  }

  return result;
}

export function logout() {
  removeItem(tokenStorageName, "local");
}

export function updateUser(user) {
  const updateUserFields = ["name", "lastNotificationCheckTime"];

  return auth(
    null,
    updateUserMutation,
    { user: getDataFromObj(user, updateUserFields) },
    "data.user.updateUser"
  );
}

export async function changePassword(password) {
  let result = await auth(
    null,
    changePasswordMutation,
    { password },
    "data.user.changePassword"
  );

  let prevToken = getItem(tokenStorageName);

  if (prevToken) {
    setItem(tokenStorageName, result.token, "local");
  }

  return result;
}

export function forgotPassword(email) {
  return query(
    null,
    forgotPasswordMutation,
    { email },
    "data.user.forgotPassword"
  );
}

export function userExists(email) {
  return query(null, userExistsQuery, { email }, "data.user.userExists");
}

export function updateCollaborationRequest(request, data) {
  const updateRequestFields = ["readAt"];

  return auth(
    null,
    updateCollaborationRequestMutation,
    {
      customId: request.customId,
      data: getDataFromObj(data, updateRequestFields)
    },
    "data.user.updateCollaborationRequest"
  );
}

export function changePasswordWithToken(token) {
  return query(
    null,
    changePasswordWithTokenMutation,
    { password: token },
    "data.user.changePasswordWithToken"
  );
}

export function respondToCollaborationRequest(request, response) {
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
  let userToken = getItem(tokenStorageName);

  if (userToken) {
    let { user, token } = await getUserData(userToken);
    setItem(tokenStorageName, token);
    return { user, token };
  }
}
