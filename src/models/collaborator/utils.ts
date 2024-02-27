import { getUserFullName } from "../user/utils";
import { getNameInitials } from "../utils";
import { ICollaborator } from "./types";

export function getUserInitials(user: Pick<ICollaborator, "firstName" | "lastName">) {
  return getNameInitials(getUserFullName(user));
}
