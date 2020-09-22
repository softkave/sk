import { createAction } from "@reduxjs/toolkit";

const loginUser = createAction<{
    token: string;
    userId: string;
    clientId: string;
    isDemo?: boolean;
}>("session/loginUser");

const setSessionToWeb = createAction("session/setSessionToWeb");

const logoutUser = createAction("session/logoutUser");

export default class SessionActions {
    public static loginUser = loginUser;
    public static logoutUser = logoutUser;
    public static setSessionToWeb = setSessionToWeb;
}
