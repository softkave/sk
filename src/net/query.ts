import { OutgoingHttpHeaders } from "http";
import get from "lodash/get";
import { getAppErrorOrAppErrorList } from "../redux/utils";
import UserSessionStorageFuncs, {
    sessionVariables,
} from "../storage/userSession";
import { devLog } from "../utils/log";
import { IAnyObject } from "../utils/types";
import { handleLoginAgainError } from "./serverRecommendedActions";

type NetResultProcessorFunction = (data: any) => any;
export type NetResultProcessor = string | NetResultProcessorFunction;

const serverAddr =
    process.env.NODE_ENV === "development"
        ? `http://localhost:5000/graphql`
        : "https://api.softkave.com/graphql";

function processQueryResult(resultBody: any, process: NetResultProcessor) {
    if (resultBody) {
        return typeof process === "string"
            ? get(resultBody, process)
            : process(resultBody);
    } else {
        return null;
    }
}

const shouldLoginAgain = (errors) => {
    if (
        Array.isArray(errors) &&
        errors.find((error) => error.action === "login-again")
    ) {
        return true;
    }

    return false;
};

const isExpectedErrorType = (errors) => {
    return Array.isArray(errors) && !!errors.find((e) => !!e.name);
};

export default async function query(
    headers: OutgoingHttpHeaders | null,
    netQuery: string,
    variables: IAnyObject,
    process: NetResultProcessor
) {
    try {
        const clientId = UserSessionStorageFuncs.getItem(
            sessionVariables.clientId
        );

        const callHeaders = {
            "Content-Type": "application/json",
            ...headers,
        };

        if (clientId) {
            callHeaders["x-client-id"] = clientId;
        }

        const result = await fetch(serverAddr, {
            headers: callHeaders,
            body: JSON.stringify({
                query: netQuery,
                variables,
            }),
            method: "POST",
            mode: "cors",
        });

        if (!result.headers.get("Content-Type")?.includes("application/json")) {
            throw new Error("An error occurred");
        }

        const rawResultBody = await result.json();
        const resultBody = processQueryResult(rawResultBody, process);
        devLog(__filename, rawResultBody);

        if (result.ok) {
            if (resultBody && shouldLoginAgain(resultBody.errors)) {
                handleLoginAgainError();
            }

            return resultBody;
        } else {
            if (result.status === 500 || result.status === 401) {
                if (rawResultBody && rawResultBody.errors) {
                    if (isExpectedErrorType(rawResultBody.errors)) {
                        if (shouldLoginAgain(rawResultBody.errors)) {
                            handleLoginAgainError();
                        } else {
                            throw rawResultBody.errors;
                        }
                    }

                    throw new Error("An error occurred");
                }
            }
        }

        throw new Error(result.statusText);
    } catch (error) {
        devLog(__filename, error);
        const errors = getAppErrorOrAppErrorList(error);

        throw errors;
    }
}
