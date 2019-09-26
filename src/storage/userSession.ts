import { getItem, setItem } from "../utils/storage";
import { userTokenKey } from "./itemKeys";

export function getUserTokenFromStorage() {
  return getItem(userTokenKey);
}

export function saveUserTokenInStorage(token) {
  setItem(userTokenKey, token);
}
