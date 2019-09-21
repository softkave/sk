import { IClearStateAction } from "../state/actions";
import { LOGIN_USER, LOGOUT_USER, UPDATE_TOKEN } from "./constants";

export interface ILoginUserAction {
  type: LOGIN_USER;
  payload: {
    token: string;
    userId: string;
  };
}

export function loginUserRedux(
  token: string,
  userId: string
): ILoginUserAction {
  return {
    type: LOGIN_USER,
    payload: {
      token,
      userId
    }
  };
}

export interface ILogoutUserAction {
  type: LOGOUT_USER;
}

export function logoutUserRedux(): ILogoutUserAction {
  return {
    type: LOGOUT_USER
  };
}

export interface IUpdateTokenAction {
  type: UPDATE_TOKEN;
  payload: {
    token: string;
  };
}

export function updateTokenRedux(token: string): IUpdateTokenAction {
  return {
    type: UPDATE_TOKEN,
    payload: {
      token
    }
  };
}

export type ISessionAction =
  | IClearStateAction
  | ILoginUserAction
  | ILogoutUserAction;
