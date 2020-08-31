import { OutgoingHttpHeaders } from "http";
import get from "lodash/get";
import isString from "lodash/isString";
import ErrorMessages from "../models/errorMessages";
import SessionSelectors from "../redux/session/selectors";
import store from "../redux/store";
import { getServerAddr } from "./addr";
import { processServerRecommendedActions } from "./serverRecommendedActions";
import { INetError } from "./types";

function getUserClientId() {
    return SessionSelectors.getClientId(store.getState());
}

const isExpectedErrorType = (errors) => {
    return Array.isArray(errors) && !!errors.find((e) => !!e.name);
};

export const toNetError = (err: Error | INetError | string): INetError => {
    const error = isString(err) ? new Error(err) : err;

    return {
        name: error.name,
        message: error.message,
        action: (error as any).action,
        field: (error as any).field,
    };
};

export const toNetErrorsArray = (err: any) => {
    if (Array.isArray(err)) {
        return err.map((error) => toNetError(error));
    } else {
        return toNetError(err);
    }
};

export interface INetCallProps {
    query: string;
    variables: any;
    paths: string[];
    headers?: OutgoingHttpHeaders;
}

export interface INetCallResult {
    errors?: INetError[];
    result?: any;
    data: { [key: string]: any };
}

export async function netCall(props: INetCallProps): Promise<INetCallResult> {
    const { query, variables, paths } = props;

    try {
        const headers = {
            "Content-Type": "application/json",
            ...(props.headers || {}),
        };

        const result = await fetch(getServerAddr(), {
            headers,
            body: JSON.stringify({
                query,
                variables,
            }),
            method: "POST",
            mode: "cors",
        });

        if (!result.headers.get("Content-Type")?.includes("application/json")) {
            throw new Error(ErrorMessages.anErrorOccurred);
        }

        const body = await result.json();
        const data: any = {};
        let errors: any;

        if (body) {
            paths.forEach((path) => {
                const d = get(body, `data.${path}`);

                if (d && d.errors) {
                    errors = (errors || []).concat(d.errors);
                }

                data[path] = d;
            });
        }

        if (result.ok) {
            if (errors && errors.length > 0) {
                const continueProcessing = processServerRecommendedActions(
                    errors
                );

                if (continueProcessing) {
                    return { errors, data, result: body };
                } else {
                    throw new Error(ErrorMessages.anErrorOccurred);
                }

                // TODO: what should we do on else
            }

            return { errors, data, result: body };
        } else {
            if (result.status === 500 || result.status === 401) {
                if (errors) {
                    if (isExpectedErrorType(errors)) {
                        const continueProcessing = processServerRecommendedActions(
                            errors
                        );

                        if (continueProcessing) {
                            return { errors, data, result: body };
                        }

                        // TODO: what should we do on else
                    }

                    throw new Error(ErrorMessages.anErrorOccurred);
                }
            }
        }

        throw new Error(result.statusText);
    } catch (error) {
        const errors = toNetErrorsArray(error);
        throw errors;
    }
}

function getToken() {
    return SessionSelectors.getUserToken(store.getState());
}

export interface INetCallWithAuthProps extends INetCallProps {
    token?: string;
}

export async function netCallWithAuth(props: INetCallWithAuthProps) {
    const requestToken = props.token || getToken();

    if (!requestToken) {
        throw new Error("Invalid credentials");
    }

    return netCall({
        ...props,
        headers: {
            Authorization: `Bearer ${requestToken}`,
            "x-client-id": getUserClientId(),
            ...props.headers,
        },
    });
}
