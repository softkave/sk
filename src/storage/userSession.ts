import { getItem } from "../utils/storage";
import { userTokenKey } from "./itemKeys";

export function getUserTokenFromStorage() {
  return getItem(userTokenKey);
}
