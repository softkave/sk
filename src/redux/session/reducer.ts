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

    case LOGOUT_USER: {
      return {};
    }

    default:
      return state;
  }
}
