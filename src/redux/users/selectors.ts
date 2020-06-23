import { IUser } from "../../models/user/user";
import { IAppState } from "../types";

export function getUser(state: IAppState, id: string) {
  return state.users[id];
}

export function getUsers(state: IAppState, ids: string[]) {
  return ids.reduce((users, id) => {
    if (state.users[id]) {
      users.push(state.users[id]);
    }

    return users;
  }, [] as IUser[]);
}

export default class UserSelectors {
  public static getUser = getUser;
  public static getUsers = getUsers;
}
