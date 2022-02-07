import { createAction } from "@reduxjs/toolkit";
import { ICollaborator } from "../../models/collaborator/types";
import { IClient, IUser } from "../../models/user/user";
import cast from "../../utils/cast";
import UserActions from "../users/actions";
import { IActionUpdate } from "../utils";

const loginUser = createAction<{
  token: string;
  userId: string;
  isDemo?: boolean;
  client?: IClient;
}>("session/loginUser");

const setSessionToWeb = createAction("session/setSessionToWeb");
const logoutUser = createAction("session/logoutUser");
const updateClient = createAction<IClient>("session/updateClient");

export default class SessionActions {
  public static loginUser = loginUser;
  public static logoutUser = logoutUser;
  public static setSessionToWeb = setSessionToWeb;
  public static updateClient = updateClient;
  public static updateUser = (arg: IActionUpdate<IUser>) => {
    return UserActions.update(cast<IActionUpdate<ICollaborator>>(arg));
  };
}
