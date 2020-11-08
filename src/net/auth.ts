import SessionSelectors from "../redux/session/selectors";
import store from "../redux/store";
import { IAnyObject } from "../utils/types";
import query, { NetResultProcessor } from "./query";

function getToken() {
    return SessionSelectors.getUserToken(store.getState());
}

function getUserClientId() {
    return SessionSelectors.getClientId(store.getState());
}

export default async function queryWithAuth(
    headers: { [key: string]: string } | null,
    netQuery: string,
    variables: IAnyObject,
    process: NetResultProcessor,
    tokenParam?: string
) {
    const requestToken = tokenParam || getToken();

    if (!requestToken) {
        throw new Error("Invalid credentials");
    }

    const clientId = getUserClientId();

    return await query(
        {
            Authorization: `Bearer ${requestToken}`,
            "x-client-id": clientId,
            ...headers,
        },
        netQuery,
        variables,
        process
    );
}

export function isUserSignedIn() {
    return SessionSelectors.isUserSignedIn(store.getState());
}
