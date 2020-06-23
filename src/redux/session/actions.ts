import { createAction } from "@reduxjs/toolkit";

const loginUser = createAction<{ token: string; userId: string }>(
  "user/loginUser"
);

const logoutUser = createAction("user/logoutUser");

const setSessionToWeb = createAction("user/setSessionToWeb");

export default class SessionActions {
  public static loginUser = loginUser;
  public static logoutUser = logoutUser;
  public static setSessionToWeb = setSessionToWeb;
}
