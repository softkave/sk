import { IReduxState } from "../store";
import { getUser } from "../users/selectors";

export function getUserToken(state: IReduxState) {
  return state.session.token;
}

export function getSignedInUser(state: IReduxState) {
  const userId = state.session.userId;

  if (userId) {
    return getUser(state, userId);
  }
}

export function isUserSignedIn(state: IReduxState) {
  return (
    !!state.session.token &&
    !!state.session.userId &&
    !!state.users[state.session.userId] &&
    !!state.users[state.session.userId].resource
  );
}
