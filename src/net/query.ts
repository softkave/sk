import { OutgoingHttpHeaders } from "http";
import get from "lodash/get";
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

    const resultBody = processQueryResult(await result.json(), process);
    devLog(__filename, resultBody);

    if (result.ok) {
      return resultBody;
    } else {
      if (result.status === 500) {
        if (resultBody && resultBody.errors) {
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
