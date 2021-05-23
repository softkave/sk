import { createAction } from "@reduxjs/toolkit";
import { IClient } from "../../models/user/user";

const loginUser =
    createAction<{
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
}
