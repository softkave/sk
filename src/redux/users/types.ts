import { IUser } from "../../models/user/user";

export interface IUsersState {
  [key: string]: IUser;
}
