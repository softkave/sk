import { IAppState } from "../types";
import { getUser } from "../users/selectors";

function getUserToken(state: IAppState) {
  return state.session.token;
}

function getSignedInUser(state: IAppState) {
  const userId = state.session.userId;

  if (userId) {
    return getUser(state, userId);
  }
}

function isUserSignedIn(state: IAppState) {
  return (
    !!state.session.token &&
    !!state.session.userId &&
    !!state.users[state.session.userId]
  );
}

function assertUserSignedIn(state: IAppState) {
  if (!isUserSignedIn(state)) {
    // TODO: central error messages location
    throw new Error("User is not signed in");
  }
}

function getSignedInUserRequired(state: IAppState) {
  assertUserSignedIn(state);

  const user = getSignedInUser(state)!;
  return user;
}

function getSessionType(state: IAppState) {
  return state.session.sessionType;
}

export default class SessionSelectors {
  public static getUserToken = getUserToken;
  public static getSignedInUser = getSignedInUser;
  public static isUserSignedIn = isUserSignedIn;
  public static getSignedInUserRequired = getSignedInUserRequired;
  public static getSessionType = getSessionType;
}
