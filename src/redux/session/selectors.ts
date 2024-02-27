import { isAnonymousUserId, isDemoUserId } from "../../models/app/utils";
import { IUser } from "../../models/user/types";
import cast from "../../utils/cast";
import { IAppState } from "../types";
import UserSelectors from "../users/selectors";

function getUserToken(state: IAppState) {
  return state.session.token;
}

function getUser(state: IAppState) {
  const userId = state.session.userId;
  if (userId) {
    return cast<IUser | undefined>(UserSelectors.getOne(state, userId));
  }
}

function isUserSignedIn(state: IAppState) {
  return !!state.session.token && !!state.session.userId && !!state.users[state.session.userId];
}

function assertUserSignedIn(state: IAppState) {
  if (!isUserSignedIn(state)) {
    // TODO: central error messages location
    throw new Error("User is not signed in");
  }
}

function assertGetUser(state: IAppState) {
  assertUserSignedIn(state);
  const user = getUser(state)!;
  return user;
}

function assertGetToken(state: IAppState) {
  assertUserSignedIn(state);
  return getUserToken(state)!;
}

function getSessionType(state: IAppState) {
  return state.session.sessionType;
}

function getClient(state: IAppState) {
  return state.session.client;
}

function assertGetClient(state: IAppState) {
  assertUserSignedIn(state);
  const client = getClient(state)!;
  return client;
}

function isDemoMode(state: IAppState) {
  return (
    !!state.session.isDemo ||
    (SessionSelectors.getUserId(state) ? isDemoUserId(SessionSelectors.getUserId(state)!) : false)
  );
}

export default class SessionSelectors {
  static getUserToken = getUserToken;
  static getUser = getUser;
  static isUserSignedIn = isUserSignedIn;
  static assertGetUser = assertGetUser;
  static getSessionType = getSessionType;
  static isDemoMode = isDemoMode;
  static assertGetToken = assertGetToken;
  static getClient = getClient;
  static assertGetClient = assertGetClient;
  static getUserId = (state: IAppState) => state.session.userId;
  static isAnonymousUser = (state: IAppState) =>
    SessionSelectors.getUserId(state)
      ? isAnonymousUserId(SessionSelectors.getUserId(state)!)
      : false;
}
