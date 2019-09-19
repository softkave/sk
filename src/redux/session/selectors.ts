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

export function assertUserSignedIn(state: IReduxState) {
  if (!isUserSignedIn(state)) {
    throw new Error("User is not signed in");
  }
}

export function getSignedInUserRequired(state: IReduxState) {
  assertUserSignedIn(state);

  const user = getSignedInUser(state)!;
  return user;
}

export function getUserTokenRequired(state: IReduxState) {
  assertUserSignedIn(state);

  const token = getUserToken(state)!;
  return token;
}
