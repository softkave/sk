import { OutgoingHttpHeaders } from "http";
import SessionSelectors from "../redux/session/selectors";
import store from "../redux/store";
import { getServerAddr } from "./addr";
import { processServerRecommendedActions } from "./serverRecommendedActions";
import { IAppError, IEndpointResultBase } from "./types";
import { toAppErrorsArray } from "./utils";

const isExpectedErrorType = (errors: Error[]) => {
    return Array.isArray(errors) && !!errors.find((e) => !!e.name);
};

export interface IInvokeEndpointParams {
    data?: any;
    path: string;
    headers?: OutgoingHttpHeaders;
}

export async function invokeEndpoint<T extends IEndpointResultBase>(
    props: IInvokeEndpointParams
): Promise<T> {
    const { data, path } = props;

    try {
        const headers = {
            "Content-Type": "application/json",
            ...(props.headers || {}),
        };

        const result = await fetch(getServerAddr() + path, {
            headers,
            body: data ? JSON.stringify(data) : undefined,
            method: "POST",
            mode: "cors",
        });

        // TODO: what if the request fails in the middleware space?
        // i.e maybe auth token decoding error or something
        if (!result.headers.get("Content-Type")?.includes("application/json")) {
            throw new Error("Error completing request!");
        }

        const body = (await result.json()) as T;
        let errors: IAppError[] | undefined = undefined;

        if (body) {
            errors = body.errors;
        }

        if (result.ok) {
            if (errors && errors.length > 0) {
                const continueProcessing = processServerRecommendedActions(
                    errors
                );

                if (continueProcessing) {
                    return body;
                } else {
                    throw new Error("Error completing request!");
                }
            }

            return body;
        } else {
            // TODO: do we still need these?
            if (result.status === 500 || result.status === 401) {
                if (errors) {
                    if (isExpectedErrorType(errors)) {
                        const continueProcessing = processServerRecommendedActions(
                            errors
                        );

                        if (continueProcessing) {
                            return body;
                        }
                    }

                    throw new Error("Error completing request!");
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

export interface IInvokeEndpointWithAuthParams extends IInvokeEndpointParams {
    token?: string;
}

export async function invokeEndpointWithAuth<T extends IEndpointResultBase>(
    props: IInvokeEndpointWithAuthParams
) {
    const requestToken = props.token || getToken();

    if (!requestToken) {
        throw new Error("Invalid credentials!");
    }

    return invokeEndpoint<T>({
        ...props,
        headers: {
            Authorization: `Bearer ${requestToken}`,
            ...props.headers,
        },
    });
}