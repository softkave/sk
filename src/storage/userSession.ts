import { getItem, removeItem, setItem } from "../utils/storage";
import { StorageKeys } from "./types";

function getUserToken() {
  return getItem(StorageKeys.Token);
}

function saveUserToken(token) {
  setItem(StorageKeys.Token, token);
}

function deleteUserToken() {
  removeItem(StorageKeys.Token);
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
}
