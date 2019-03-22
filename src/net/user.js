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

const user = {
  signup(user) {
    const userFields = ["name", "password", "email"];

    return query(
      null,
      userSignupMutation,
      { user: getDataFromObj(user, userFields) },
      "data.user.signup"
    );
  },

  login(user) {
    return query(
      null,
      userLoginMutation,
      { user: user.email, password: user.password },
      "data.user.login"
    );
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
    return auth(
      null,
      changePasswordMutation,
      { password },
      "data.user.changePassword"
    );
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
  }
};

export default user;
