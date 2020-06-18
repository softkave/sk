import { IAppState } from "../store";
import { getUser } from "../users/selectors";

export function getUserToken(state: IAppState) {
  return state.session.token;
}

export function getKeyValue(state: IAppState, key: string) {
  return state.keyValue[key];
}
