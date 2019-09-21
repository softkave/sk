import { CLEAR_STATE } from "../state/constants";
import { ISessionAction } from "./actions";
import { LOGIN_USER, LOGOUT_USER } from "./constants";

export interface ISessionState {
  token?: string;
  userId?: string;
}

export function sessionReducer(
  state: ISessionState = {},
  action: ISessionAction
): ISessionState {
  switch (action.type) {
    case LOGIN_USER: {
      return {
        token: action.payload.token,
        userId: action.payload.userId
      };
    }

    case CLEAR_STATE:
    case LOGOUT_USER: {
      return {};
    }

    default:
      return state;
  }
}
