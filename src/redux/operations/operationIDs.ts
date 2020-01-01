// block
export const loadRootBlocksOperationID = "loadRootBlocksOperationID";
export const addBlockOperationID = "addBlockOperationID";
export const updateBlockOperationID = "updateBlockOperationID";
export const toggleTaskOperationID = "toggleTaskOperationID";
export const deleteBlockOperationID = "deleteBlockOperationID";
export const addCollaboratorsOperationID = "addCollaboratorsOperationID";
export const getBlockOperationID = "getBlockOperationID";
export const getBlockChildrenOperationID = "getBlockChildrenOperationID";
export const getBlockCollaboratorsOperationID =
  "getBlockCollaboratorsOperationID";
export const getBlockCollaborationRequestsOperationID =
  "getBlockCollaborationRequestsOperationID";
export const transferBlockOperationID = "transferBlockOperationID";
export const getTasksAssignedToUserOperationID =
  "getTasksAssignedToUserOperationID";
export const getBlocksWithCustomIDsOperationID =
  "getBlocksWithCustomIDsOperationID";

// notification
export const loadUserNotificationsOperationID =
  "loadUserNotificationsOperationID";
export const updateNotificationOperationID = "updateNotificationOperationID";
export const respondToNotificationOperationID =
  "respondToNotificationOperationID";

// user
export const updateUserOperationID = "updateUserOperationID";

// session
export const initializeAppSessionOperationID =
  "initializeAppSessionOperationID";
export const signupUserOperationID = "signupUserOperationID";
export const loginUserOperationID = "loginUserOperationID";
export const requestForgotPasswordOperationID =
  "requestForgotPasswordOperationID";
export const changePasswordOperationID = "changePasswordOperationID";

export default class OperationIDs {
  // block
  public static loadRootBlocks = loadRootBlocksOperationID;
  public static addBlock = addBlockOperationID;
  public static updateBlock = updateBlockOperationID;
  public static toggleTask = toggleTaskOperationID;
  public static deleteBlock = deleteBlockOperationID;
  public static addCollaborators = addCollaboratorsOperationID;
  public static getBlock = getBlockOperationID;
  public static getBlockChildren = getBlockChildrenOperationID;
  public static getBlockCollaborators = getBlockCollaboratorsOperationID;
  public static getBlockCollaborationRequests = getBlockCollaborationRequestsOperationID;
  public static transferBlock = transferBlockOperationID;
  public static getTasksAssignedToUser = getTasksAssignedToUserOperationID;
  public static getBlocksWithCustomIDs = getBlocksWithCustomIDsOperationID;

  // notification
  public static loadUserNotifications = loadUserNotificationsOperationID;
  public static updateNotification = updateNotificationOperationID;
  public static respondToNotification = respondToNotificationOperationID;

  // user
  public static updateUser = updateUserOperationID;

  // session
  public static initializeAppSession = initializeAppSessionOperationID;
  public static signupUser = signupUserOperationID;
  public static loginUser = loginUserOperationID;
  public static requestForgotPassword = requestForgotPasswordOperationID;
  public static changePassword = changePasswordOperationID;
  public static getSessionDetails = "getSessionDetails";
}
