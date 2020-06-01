import { OutgoingHttpHeaders } from "http";
import get from "lodash/get";
import isString from "lodash/isString";
import ErrorMessages from "../models/ErrorMessages";
import { INetError } from "../net/query";
import { getServerAddr } from "./addr";
import { processServerRecommendedActions } from "./serverRecommendedActions";

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

export async function netCall(props: INetCallProps) {
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
    const errors = body
      ? paths.reduce((accumulator, path) => {
          const d = get(body, path);

          if (d && d.errors) {
            accumulator = accumulator.concat(d.errors);
          }

          return accumulator;
        }, [])
      : undefined;

    if (result.ok) {
      return body;
    } else {
      if (result.status === 500 || result.status === 401) {
        if (errors) {
          if (isExpectedErrorType(errors)) {
            const continueProcessing = processServerRecommendedActions(errors);

            if (continueProcessing) {
              return body;
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
