const {
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
} = require("./schema/user");
const query = require("query");
const auth = require("./auth");
const { getDataFromObj } = require("../utils/object");

module.exports = {
  userSignupMutation(user) {
    const userFields = ["name", "password", "email"];

    return query(
      null,
      userSignupMutation,
      { user: getDataFromObj(user, userFields) },
      "data.user.signup"
    );
  },

  userLoginMutation(user) {
    return query(
      null,
      userLoginMutation,
      { user: user.email, password: user.password },
      "data.user.login"
    );
  },

  updateUserMutation(user) {
    const updateUserFields = ["name", "lastNotificationCheckTime"];

    return auth(
      null,
      updateUserMutation,
      { user: getDataFromObj(user, updateUserFields) },
      "data.user.updateUser"
    );
  },

  changePasswordMutation(password) {
    return auth(
      null,
      changePasswordMutation,
      { password },
      "data.user.changePassword"
    );
  },

  forgotPasswordMutation(email) {
    return query(
      null,
      forgotPasswordMutation,
      { email },
      "data.user.forgotPassword"
    );
  },

  userExistsQuery(email) {
    return query(null, userExistsQuery, { email }, "data.user.userExists");
  },

  updateCollaborationRequestMutation(request, data) {
    const updateRequestFields = ["readAt"];

    return auth(
      null,
      updateCollaborationRequestMutation,
      { id: request.id, data: getDataFromObj(data, updateRequestFields) },
      "data.user.updateCollaborationRequest"
    );
  },

  changePasswordWithTokenMutation(token) {
    return query(
      null,
      changePasswordWithTokenMutation,
      { password: token },
      "data.user.changePasswordWithToken"
    );
  },

  respondToCollaborationRequestMutation(request, response) {
    return auth(
      null,
      respondToCollaborationRequestMutation,
      { response, id: request.id },
      "data.user.respondToCollaborationRequest"
    );
  },

  getCollaborationRequestsQuery() {
    return auth(
      null,
      getCollaborationRequestsQuery,
      {},
      "data.user.getCollaborationRequests"
    );
  }
};
