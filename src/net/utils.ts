import { OutgoingHttpHeaders } from "http";
import get from "lodash/get";
import isString from "lodash/isString";
import ErrorMessages from "../models/errorMessages";
import SessionSelectors from "../redux/session/selectors";
import store from "../redux/store";
import UserSessionStorageFuncs, {
    sessionVariables,
} from "../storage/userSession";
import { getServerAddr } from "./addr";
import { processServerRecommendedActions } from "./serverRecommendedActions";
import { IAppError } from "./types";

const isExpectedErrorType = (errors) => {
    return Array.isArray(errors) && !!errors.find((e) => !!e.name);
};

export const toAppError = (err: Error | IAppError | string): IAppError => {
    const error = isString(err) ? new Error(err) : err;

    return {
        name: error.name,
        message: error.message,
        action: (error as any).action,
        field: (error as any).field,
    };
};

export const toAppErrorsArray = (err: any) => {
    if (Array.isArray(err)) {
        return err.map((error) => toAppError(error));
    } else {
        return toAppError(err);
    }
};

export interface IInvokeGraphQLParams {
    query: string;
    variables: any;
    paths: string[];
    headers?: OutgoingHttpHeaders;
}

export interface IInvokeGraphQLResult {
    errors?: IAppError[];
    result?: any;
    data: { [key: string]: any };
}

export async function invokeGraphQL(
    props: IInvokeGraphQLParams
): Promise<IInvokeGraphQLResult> {
    const { query, variables, paths } = props;

    try {
        const clientId = UserSessionStorageFuncs.getItem(
            sessionVariables.clientId
        );

        const headers = {
            "Content-Type": "application/json",
            ...(props.headers || {}),
        };

        if (clientId) {
            headers["x-client-id"] = clientId;
        }

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
            throw new Error(ErrorMessages.AN_ERROR_OCCURRED);
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
                    throw new Error(ErrorMessages.AN_ERROR_OCCURRED);
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

                    throw new Error(ErrorMessages.AN_ERROR_OCCURRED);
                }
            }
        }

        throw new Error(result.statusText);
    } catch (error) {
        const errors = toAppErrorsArray(error);
        throw errors;
    }
}

function getToken() {
    return SessionSelectors.getUserToken(store.getState());
}

export interface IInvokeGraphQLWithAuthParams extends IInvokeGraphQLParams {
    token?: string;
}

export async function invokeGraphQLWithAuth(
    props: IInvokeGraphQLWithAuthParams
) {
    const requestToken = props.token || getToken();

    if (!requestToken) {
        throw new Error("Invalid credentials");
    }

    return invokeGraphQL({
        ...props,
        headers: {
            Authorization: `Bearer ${requestToken}`,
            ...props.headers,
        },
    });
}
