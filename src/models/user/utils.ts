import { IUser } from "./types";

export function getUserFullName(user: Pick<IUser, "firstName" | "lastName">) {
  return `${user.firstName} ${user.lastName}`;
}
