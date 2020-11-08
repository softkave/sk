enum OperationType {
    // block
    LOAD_ROOT_BLOCKS = "LOAD_ROOT_BLOCKS",
    ADD_BLOCK = "ADD_BLOCK",
    UPDATE_BLOCK = "UPDATE_BLOCK",
    DELETE_BLOCK = "DELETE_BLOCK",
    LOAD_BLOCK_CHILDREN = "LOAD_BLOCK_CHILDREN",
    ADD_COLLABORATORS = "ADD_COLLABORATORS",
    FETCH_BLOCK_BROADCASTS = "FETCH_BLOCK_BROADCASTS",

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
    ADD_SPRINT = "ADD_SPRINT",
    DELETE_SPRINT = "DELETE_SPRINT",
    END_SPRINT = "END_SPRINT",
    GET_SPRINTS = "GET_SPRINTS",
    SETUP_SPRINTS = "SETUP_SPRINTS",
    SPRINT_EXISTS = "SPRINT_EXISTS",
    START_SPRINT = "START_SPRINT",
    UPDATE_SPRINT = "UPDATE_SPRINT",
    UPDATE_SPRINT_OPTIONS = "UPDATE_SPRINT_OPTIONS",

    // system
    SendFeedback = "SendFeedback",
}

export default OperationType;
