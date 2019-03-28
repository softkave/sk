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
  getCollaborationRequestsQuery
} from "./schema/user";
import query from "./query";
import auth from "./auth";
import { getDataFromObj } from "../utils/object";
import { setItem, getItem, removeItem } from "../utils/storage";

const tokenStorageName = "t";

const user = {
  async signup(user) {
    const userFields = ["name", "password", "email"];

    let result = await query(
      null,
      userSignupMutation,
      { user: getDataFromObj(user, userFields) },
      "data.user.signup"
    );

    if (user.remember) {
      setItem(tokenStorageName, result.token, "local");
    }

    return result;
  },

  login(user) {
    let result = query(
      null,
      userLoginMutation,
      { user: user.email, password: user.password },
      "data.user.login"
    );

    let prevToken = getItem(tokenStorageName, "local");

    if (prevToken) {
      setItem(tokenStorageName, result.token, "local");
    }

    return result;
  },

  logout() {
    removeItem(tokenStorageName, "local");
  },

  updateUser(user) {
    const updateUserFields = ["name", "lastNotificationCheckTime"];

    return auth(
      null,
      updateUserMutation,
      { user: getDataFromObj(user, updateUserFields) },
      "data.user.updateUser"
    );
  },

  changePassword(password) {
    let result = auth(
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
  },

  forgotPassword(email) {
    return query(
      null,
      forgotPasswordMutation,
      { email },
      "data.user.forgotPassword"
    );
  },

  userExists(email) {
    return query(null, userExistsQuery, { email }, "data.user.userExists");
  },

  updateCollaborationRequest(request, data) {
    const updateRequestFields = ["readAt"];

    return auth(
      null,
      updateCollaborationRequestMutation,
      { id: request.id, data: getDataFromObj(data, updateRequestFields) },
      "data.user.updateCollaborationRequest"
    );
  },

  changePasswordWithToken(token) {
    return query(
      null,
      changePasswordWithTokenMutation,
      { password: token },
      "data.user.changePasswordWithToken"
    );
  },

  respondToCollaborationRequest(request, response) {
    return auth(
      null,
      respondToCollaborationRequestMutation,
      { response, id: request.id },
      "data.user.respondToCollaborationRequest"
    );
  },

  getCollaborationRequests() {
    return auth(
      null,
      getCollaborationRequestsQuery,
      {},
      "data.user.getCollaborationRequests"
    );
  },

  getDataWithToken() {},

  getSavedUserData() {
    let userToken = getItem(tokenStorageName, "local");

    if (userToken) {
      return this.getDataWithToken(userToken);
    }
  }
};

export default user;
