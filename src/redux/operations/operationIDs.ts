// block
export const loadRootBlocksOperationId = "loadRootBlocksOperationId";
export const addBlockOperationId = "addBlockOperationId";
export const updateBlockOperationId = "updateBlockOperationId";
export const deleteBlockOperationId = "deleteBlockOperationId";
export const addCollaboratorsOperationId = "addCollaboratorsOperationId";

// notification
export const loadUserNotificationsOperationId =
  "loadUserNotificationsOperationId";
export const updateNotificationOperationId = "updateNotificationOperationId";
export const respondToNotificationOperationId =
  "respondToNotificationOperationId";

// user
export const updateUserOperationId = "updateUserOperationId";

// session
export const initializeAppSessionOperationId =
  "initializeAppSessionOperationId";
export const signupUserOperationId = "signupUserOperationId";
export const loginUserOperationId = "loginUserOperationId";
export const requestForgotPasswordOperationId =
  "requestForgotPasswordOperationId";
export const changePasswordOperationId = "changePasswordOperationId";

// TODO: convert to enum
export default class OperationIds {
  // block
  public static loadRootBlocks = loadRootBlocksOperationId;
  public static addBlock = addBlockOperationId;
  public static updateBlock = updateBlockOperationId;
  public static deleteBlock = deleteBlockOperationId;
  public static addCollaborators = addCollaboratorsOperationId;

  // notification
  public static loadUserNotifications = loadUserNotificationsOperationId;
  public static updateNotification = updateNotificationOperationId;
  public static respondToNotification = respondToNotificationOperationId;

  // user
  public static updateUser = updateUserOperationId;

  // session
  public static initializeAppSession = initializeAppSessionOperationId;
  public static signupUser = signupUserOperationId;
  public static loginUser = loginUserOperationId;
  public static requestForgotPassword = requestForgotPasswordOperationId;
  public static changePassword = changePasswordOperationId;
  public static getSessionDetails = "getSessionDetails";
}
