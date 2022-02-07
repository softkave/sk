enum OperationType {
  // block
  LoadRootBlocks = "LoadRootBlocks",
  AddBlock = "AddBlock",
  UpdateBlock = "UpdateBlock",
  DeleteBlock = "DeleteBlock",
  LoadBlockChildren = "LoadBlockChildren",
  FetchBlockBroadcasts = "FetchBlockBroadcasts",
  GetAverageTimeToCompleteTasks = "GetAverageTimeToCompleteTasks",

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
  ChangePasswordWithForgotToken = "ChangePasswordWithForgotToken",
  ChangePasswordWithCurrentPassword = "ChangePasswordWithCurrentPassword",
  UpdateClient = "UpdateClient",

  // organization
  OrganizationExists = "OrganizationExists",
  CreateOrganization = "CreateOrganization",
  GetUserOrganizations = "GetUserOrganizations",
  UpdateOrganization = "UpdateOrganization",
  PopulateOrganizationRooms = "PopulateOrganizationRooms",

  // board
  CreateBoard = "CreateBoard",
  BoardExists = "BoardExists",
  DeleteBoard = "DeleteBoard",
  GetOrganizationBoards = "GetOrganizationBoards",
  UpdateBoard = "UpdateBoard",
  GetBoard = "GetBoard",

  // task
  CreateTask = "CreateTask",
  DeleteTask = "DeleteTask",
  GetBoardTasks = "GetBoardTasks",
  TransferTask = "TransferTask",
  UpdateTask = "UpdateTask",
  LoadTaskComments = "LoadTaskComments",

  // collaboration request
  AddCollaborators = "AddCollaborators",
  RevokeRequest = "RevokeRequest",
  RespondToRequest = "RespondToRequest",
  MarkRequestRead = "MarkRequestRead",
  GetUserRequests = "GetUserRequests",
  GetOrganizationRequests = "GetOrganizationRequests",

  // collaborator
  GetOrganizationCollaborators = "GetOrganizationCollaborators",
  RemoveCollaborator = "RemoveCollaborator",

  // chat
  GetUserRoomsAndChats = "GetUserRoomsAndChats",
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
}

export default OperationType;
