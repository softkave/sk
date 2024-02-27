import { appConstants } from "../models/app/constants";
import { getItem, removeItem, setItem } from "../utils/storage";

function getKey(key: string) {
  return `${appConstants.appShortName}.${key}`;
}

export const sessionVariables = {
  token: getKey("t"),
  anonymousToken: getKey("anonymousToken"),
  hasUserSeenNotificationsPermissionDialog: getKey("hasUserSeenNotificationsPermissionDialog"),
  muteChatNotifications: getKey("muteChatNotifications"),
  clientId: getKey("clientId"),
  isSubcribedToPushNotifications: getKey("isSubcribedToPushNotifications"),
};

// A list of keys to delete from storage when the user logouts
const userSessionVariables = [
  sessionVariables.hasUserSeenNotificationsPermissionDialog,
  sessionVariables.muteChatNotifications,
];

function getUserLoggedInToken() {
  return getItem(sessionVariables.token) as string | undefined;
}
function getAnonymousUserToken() {
  return getItem(sessionVariables.anonymousToken) as string | undefined;
}
function getUserToken() {
  return getUserLoggedInToken() || getAnonymousUserToken();
}

function saveUserToken(token) {
  setItem(sessionVariables.token, token);
}
function saveAnonymousUserToken(token) {
  setItem(sessionVariables.anonymousToken, token);
}

function deleteLoggedInUserToken() {
  removeItem(sessionVariables.token);
}
function deleteUserToken() {
  if (getItem(sessionVariables.token)) {
    removeItem(sessionVariables.token);
  } else if (getItem(sessionVariables.anonymousToken)) {
    removeItem(sessionVariables.anonymousToken);
  }
}

function saveTokenIfExists(token) {
  if (getUserLoggedInToken()) {
    saveUserToken(token);
  }
}

function deleteUserVariables() {
  deleteUserToken();
  userSessionVariables.forEach((key) => removeItem(key));
}

export default class UserSessionStorageFuncs {
  static getUserToken = getUserToken;
  static getUserLoggedInToken = getUserLoggedInToken;
  static getAnonymousUserToken = getAnonymousUserToken;
  static saveUserToken = saveUserToken;
  static saveAnonymousUserToken = saveAnonymousUserToken;
  static deleteUserToken = deleteUserToken;
  static deleteLoggedInUserToken = deleteLoggedInUserToken;
  static saveTokenIfExists = saveTokenIfExists;
  static deleteUserVariables = deleteUserVariables;

  static setItem = setItem;
  static getItem = getItem;
  static removeItem = removeItem;
}
