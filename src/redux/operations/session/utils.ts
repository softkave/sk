import {
  getUserTokenFromStorage,
  saveUserTokenToStorage
} from "../../../storage/userSession";

export function saveUserTokenIfAlreadySaved(token: string) {
  const currentToken = getUserTokenFromStorage();

  if (currentToken) {
    saveUserTokenToStorage(token);
  }
}
