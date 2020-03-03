import { OutgoingHttpHeaders } from "http";
import get from "lodash/get";
import logoutUserOperationFunc from "../redux/operations/session/logoutUser";
import { devLog } from "../utils/log";
import OperationError, {
  defaultOperationError
} from "../utils/operation-error/OperationError";
import OperationErrorItem, {
  anErrorOccurredMessage,
  defaultOperationErrorItemField
} from "../utils/operation-error/OperationErrorItem";
import { IAnyObject } from "../utils/types";

type NetResultProcessorFunction = (data: any) => any;
export type NetResultProcessor = string | NetResultProcessorFunction;

const serverAddr =
  process.env.NODE_ENV === "development"
    ? `http://localhost:5000/graphql`
    : "https://api.softkave.com/graphql";

const defaultQueryError = OperationError.fromAny(defaultOperationError);

function makeSingleQueryError(
  message = anErrorOccurredMessage,
  field = defaultOperationErrorItemField
) {
  return new OperationError([new OperationErrorItem(field, message, field)]);
}

function processQueryResult(resultBody: any, process: NetResultProcessor) {
  if (resultBody) {
    return typeof process === "string"
      ? get(resultBody, process)
      : process(resultBody);
  } else {
    return null;
  }
}

const shouldLoginAgain = errors => {
  if (
    Array.isArray(errors) &&
    errors.find(error => error.action === "login-again")
  ) {
    return true;
  }

  return false;
};

const isExpectedErrorType = errors => {
  return Array.isArray(errors) && !!errors.find(e => !!e.name);
};

export default async function query(
  headers: OutgoingHttpHeaders | null,
  netQuery: string,
  variables: IAnyObject,
  process: NetResultProcessor
) {
  try {
    const hd = {
      "Content-Type": "application/json",
      ...headers
    };

    const result = await fetch(serverAddr, {
      headers: hd,
      body: JSON.stringify({
        query: netQuery,
        variables
      }),
      method: "POST",
      mode: "cors"
    });

    if (!result.headers.get("Content-Type")?.includes("application/json")) {
      throw defaultQueryError;
    }

    const rawResultBody = await result.json();
    const resultBody = processQueryResult(rawResultBody, process);
    devLog(__filename, resultBody);

    if (result.ok) {
      if (resultBody && shouldLoginAgain(resultBody.errors)) {
        logoutUserOperationFunc();
      }

      return resultBody;
    } else {
      if (result.status === 500 || result.status === 401) {
        if (rawResultBody && rawResultBody.errors) {
          if (isExpectedErrorType(rawResultBody.errors)) {
            if (shouldLoginAgain(rawResultBody.errors)) {
              logoutUserOperationFunc();
            } else {
              throw rawResultBody.errors;
            }
          }

          throw defaultQueryError;
        }
      }
    }

    throw makeSingleQueryError(result.statusText);
  } catch (error) {
    devLog(__filename, error);

    if (Array.isArray(error)) {
      throw error;
    } else {
      throw defaultQueryError;
    }
  }
}

export interface INetError {
  field?: string;
  message?: string;
  action?: string;
  type: string;
}

export interface INetResult extends IAnyObject {
  errors?: INetError[];
}
