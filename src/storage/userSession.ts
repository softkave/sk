import { AppConstants } from "../models/app/types";
import { getItem, removeItem, setItem } from "../utils/storage";

function getKey(key: string) {
    return `${AppConstants.appShortName}.${key}`;
}

export const sessionVariables = {
    token: getKey("t"),
    hasUserSeenNotificationsPermissionDialog: getKey(
        "hasUserSeenNotificationsPermissionDialog"
    ),
    muteChatNotifications: getKey("muteChatNotifications"),
    clientId: getKey("clientId"),
    pushNotificationSubscibed: getKey("pushNotificationSubscibed"),
};

function getUserToken() {
    return getItem(sessionVariables.token);
}

function saveUserToken(token) {
    setItem(sessionVariables.token, token);
}

function deleteUserToken() {
    removeItem(sessionVariables.token);
}

function saveTokenIfExists(token) {
    if (getUserToken()) {
        saveUserToken(token);
    }
}

export default class UserSessionStorageFuncs {
    public static getUserToken = getUserToken;
    public static saveUserToken = saveUserToken;
    public static deleteUserToken = deleteUserToken;
    public static saveTokenIfExists = saveTokenIfExists;

    public static setItem = setItem;
    public static getItem = getItem;
    public static removeItem = removeItem;
}
