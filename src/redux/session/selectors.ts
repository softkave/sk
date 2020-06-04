import { IAppState } from "../store";
import { getUser } from "../users/selectors";

export function getUserToken(state: IAppState) {
  return state.session.token;
}

export function getSignedInUser(state: IAppState) {
  const userId = state.session.userId;

  if (userId) {
    return getUser(state, userId);
  }
}

export function isUserSignedIn(state: IAppState) {
  return (
    !!state.session.token &&
    !!state.session.userId &&
    !!state.users[state.session.userId] &&
    !!state.users[state.session.userId].resource
  );
}

export function assertUserSignedIn(state: IAppState) {
  if (!isUserSignedIn(state)) {
    // TODO: Change to operation error
    throw new Error("User is not signed in");
  }
}

export function getSignedInUserRequired(state: IAppState) {
  assertUserSignedIn(state);

  const user = getSignedInUser(state)!;
  return user;
}

export function getUserTokenRequired(state: IAppState) {
  assertUserSignedIn(state);

  const token = getUserToken(state)!;
  return token;
}

export function getSessionType(state: IAppState) {
  return state.session.sessionType;
}
