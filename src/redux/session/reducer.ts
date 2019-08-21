import { CLEAR_STATE } from "../constants";
import { ISessionAction } from "./actions";
import { LOGIN_USER, LOGOUT_USER } from "./constants";

export interface ISessionReduxState {
  token?: string;
  userId?: string;
}

export function sessionReducer(
  state: ISessionReduxState = {},
  action: ISessionAction
): ISessionReduxState {
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
