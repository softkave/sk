import get from "lodash/get";
import { devLog } from "../utils/log";
import { IAnyObject } from "../utils/types";

const serverAddr =
  process.env.NODE_ENV === "development"
    ? `http://localhost:5000/graphql`
    : "https://api.softkave.com/graphql";

const errorOccurredMessage = "An error occurrred";
const defaultQueryError = [{ field: "error", message: errorOccurredMessage }];

function makeSingleQueryError(message, field = "error") {
  return [{ field, message }];
}

function processQueryResult(resultBody, process) {
  if (resultBody) {
    return typeof process === "string"
      ? get(resultBody, process)
      : process(resultBody);
  } else {
    return null;
  }
}

export default async function query(headers, netQuery, variables, process) {
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
    devLog(resultBody);

    if (result.ok) {
      return resultBody;
    } else {
      if (result.status === 500) {
        if (resultBody && resultBody.errors) {
          throw defaultQueryError;
        }
      }
    }

    throw makeSingleQueryError(result.statusText || errorOccurredMessage);
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
  errors?: INetError;
}
