import { getItem, removeItem, setItem } from "../utils/storage";
import { userTokenKey } from "./itemKeys";

export function getUserTokenFromStorage() {
  return getItem(userTokenKey);
}

export function saveUserTokenToStorage(token) {
  setItem(userTokenKey, token);
}

export function deleteUserTokenInStorage() {
  removeItem(userTokenKey);
}
