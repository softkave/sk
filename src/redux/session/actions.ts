import { LOGIN_USER, LOGOUT_USER, UPDATE_TOKEN } from "./constants";

export interface ILoginUserAction {
  type: LOGIN_USER;
  payload: {
    token: string;
    userId: string;
  };
}

export function loginUser(token: string, userId: string): ILoginUserAction {
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

export function logoutUser(): ILogoutUserAction {
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

export function updateToken(token: string): IUpdateTokenAction {
  return {
    type: UPDATE_TOKEN,
    payload: {
      token
    }
  };
}

export type ISessionAction = ILoginUserAction | ILogoutUserAction;
