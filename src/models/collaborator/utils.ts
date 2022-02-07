import { getNameInitials } from "../utils";
import { ICollaborator } from "./types";

export function getUserInitials(user: ICollaborator) {
  return getNameInitials(user.name);
}
