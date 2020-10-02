enum OperationType {
    // block
    LoadRootBlocks = "LoadRootBlocks",
    AddBlock = "AddBlock",
    UpdateBlock = "UpdateBlock",
    DeleteBlock = "DeleteBlock",
    LoadBlockChildren = "LoadBlockChildren",
    AddCollaborators = "AddCollaborators",

    // notification
    LoadUserNotifications = "LoadUserNotifications",
    MarkNotificationRead = "MarkNotificationRead",
    RespondToNotification = "RespondToNotification",

    // user
    UpdateUser = "UpdateUser",

    // session
    InitializeAppSession = "InitializeAppSession",
    SignupUser = "SignupUser",
    LoginUser = "LoginUser",
    RequestForgotPassword = "RequestForgotPassword",
    ChangePassword = "ChangePassword",

    // board
    LoadOrgUsersAndRequests = "LoadOrgUsersAndRequests",

    // chat
    GetUserRoomsAndChats = "getUserRoomsAndChats",
    SendMessage = "SendMessage",
    UpdateRoomReadCounter = "UpdateRoomReadCounter",
}

export default OperationType;
