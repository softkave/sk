enum OperationIds {
  // block
  LoadRootBlocks = "loadRootBlocks",
  AddBlock = "addBlock",
  UpdateBlock = "updateBlock",
  DeleteBlock = "deleteBlock",
  AddCollaborators = "addCollaborators",

  // notification
  LoadUserNotifications = "loadUserNotifications",
  UpdateNotification = "updateNotification",
  RespondToNotification = "respondToNotification",

  // user
  UpdateUser = "updateUser",

  // session
  InitializeAppSession = "initializeAppSession",
  SignupUser = "signupUser",
  LoginUser = "loginUser",
  RequestForgotPassword = "requestForgotPassword",
  ChangePassword = "changePassword",
}

export default OperationIds;
