import { createAction } from "@reduxjs/toolkit";
import { ICollaborator } from "../../models/collaborator/types";
import { IClient, IUser } from "../../models/user/types";
import cast from "../../utils/cast";
import UserActions from "../users/actions";
import { IActionUpdate } from "../utils";
import { ISessionState, SessionType } from "./types";

const loginUser = createAction<{
  token: string;
  userId: string;
  isDemo?: boolean;
  client?: IClient;
}>("session/loginUser");

const setSession = createAction<SessionType>("session/setSession");
const logoutUser = createAction("session/logoutUser");
const updateClient = createAction<IClient>("session/updateClient");
const updateSession = createAction<Partial<ISessionState>>("session/updateSession");

export default class SessionActions {
  static loginUser = loginUser;
  static logoutUser = logoutUser;
  static setSession = setSession;
  static updateClient = updateClient;
  static updateSession = updateSession;
  static updateUser = (arg: IActionUpdate<IUser>) => {
    return UserActions.update(cast<IActionUpdate<ICollaborator>>(arg));
  };
}
