import { IAppState } from "../types";
import UserSelectors from "../users/selectors";

function getUserToken(state: IAppState) {
    return state.session.token;
}

function getUser(state: IAppState) {
    const userId = state.session.userId;

    if (userId) {
        return UserSelectors.getUser(state, userId);
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

function assertGetUser(state: IAppState) {
    assertUserSignedIn(state);

    const user = getUser(state)!;
    return user;
}

function getSessionType(state: IAppState) {
    return state.session.sessionType;
}

function getClientId(state: IAppState) {
    return state.session.clientId;
}

function isDemoMode(state: IAppState) {
    return !!state.session.isDemo;
}

export default class SessionSelectors {
    public static getUserToken = getUserToken;
    public static getUser = getUser;
    public static isUserSignedIn = isUserSignedIn;
    public static assertGetUser = assertGetUser;
    public static getSessionType = getSessionType;
    public static getClientId = getClientId;
    public static isDemoMode = isDemoMode;
}
