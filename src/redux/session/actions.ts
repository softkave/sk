import { createAction } from "@reduxjs/toolkit";

const loginUser = createAction<{ token: string; userId: string }>(
  "session/loginUser"
);

const logoutUser = createAction("session/logoutUser");

const setSessionToWeb = createAction("session/setSessionToWeb");

export default class SessionActions {
  public static loginUser = loginUser;
  public static logoutUser = logoutUser;
  public static setSessionToWeb = setSessionToWeb;
}
