enum OperationType {
    // block
    LoadRootBlocks = "LoadRootBlocks",
    AddBlock = "AddBlock",
    UpdateBlock = "UpdateBlock",
    DeleteBlock = "DeleteBlock",
    LoadBlockChildren = "LoadBlockChildren",
    AddCollaborators = "AddCollaborators",
    FetchBlockBroadcasts = "FetchBlockBroadcasts",

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

    // sprint
    AddSprint = "AddSprint",
    DeleteSprint = "DeleteSprint",
    EndSprint = "EndSprint",
    GetSprints = "GetSprints",
    SetupSprints = "SetupSprints",
    SprintExists = "SprintExists",
    StartSprint = "StartSprint",
    UpdateSprint = "UpdateSprint",
    UpdateSprintOptions = "UpdateSprintOptions",

    // system
    SendFeedback = "SendFeedback",

    // access control
    SetPermissions = "SetPermissions",
    AddPermissionGroups = "AddPermissionGroups",
    UpdatePermissionGroups = "UpdatePermissionGroups",
    DeletePermissionGroups = "DeletePermissionGroups",
    GetResourcePermissions = "GetResourcePermissions",
    GetResourcePermissionGroups = "GetResourcePermissionGroups",
    PermissionExists = "PermissionExists",
    GetUserPermissions = "GetUserPermissions",
}

export default OperationType;
