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
    isSubcribedToPushNotifications: getKey("isSubcribedToPushNotifications"),
};

// a list of keys to delete from storage when the user logouts
const userAttachedVariables = [
    sessionVariables.token,
    sessionVariables.hasUserSeenNotificationsPermissionDialog,
    sessionVariables.muteChatNotifications,
];

function getUserToken() {
    return getItem(sessionVariables.token) as string | undefined;
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

function deleteUserVariables() {
    userAttachedVariables.forEach((key) => removeItem(key));
}

export default class UserSessionStorageFuncs {
    public static getUserToken = getUserToken;
    public static saveUserToken = saveUserToken;
    public static deleteUserToken = deleteUserToken;
    public static saveTokenIfExists = saveTokenIfExists;
    public static deleteUserVariables = deleteUserVariables;

    public static setItem = setItem;
    public static getItem = getItem;
    public static removeItem = removeItem;
}
