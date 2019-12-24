import { ISessionAction } from "./actions";
import { LOGIN_USER, LOGOUT_USER, SET_SESSION_TO_WEB } from "./constants";

export const sessionInitializing = "initializing";
export const sessionWeb = "web";
export const sessionApp = "app";
export const sessionUninitialized = "uninitialized";

export type SessionType =
  | typeof sessionInitializing
  | typeof sessionWeb
  | typeof sessionApp
  | typeof sessionUninitialized;

export interface ISessionState {
  sessionType: SessionType;
  token?: string;
  userId?: string;
}

export function sessionReducer(
  state: ISessionState = { sessionType: sessionUninitialized },
  action: ISessionAction
): ISessionState {
  switch (action.type) {
    case LOGIN_USER: {
      return {
        sessionType: sessionApp,
        token: action.payload.token,
        userId: action.payload.userId
      };
    }

    case LOGOUT_USER:
    case SET_SESSION_TO_WEB: {
      return { sessionType: sessionWeb };
    }

    default:
      return state;
  }
}
