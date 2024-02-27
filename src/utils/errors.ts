import { isArray, isObject, isString } from "lodash";

export interface IAppError extends Error {
  field?: string;
  action?: string;
}

export type ErrorLike = string | string[] | Error | Error[] | IAppError | IAppError[];

export class UnsurportedBrowserError extends Error {
  name = "UnsurportedBrowserError";
  message =
    "Your browser lack some features we rely on for a smooth experience. Please consider updating your browser";
}

export class UnknownError extends Error {
  name = "UnknownError";
  message = "An unknown error has occurred";
}

export class SaveError extends Error {
  name = "SaveError";
  message = "Error saving data";
}

export function isError(error: any): error is Error {
  return isObject(error) && isString((error as Error).message);
}

export function isErrorLike(error: any): error is string | Error {
  return isString(error) || isError(error);
}

export function getErrorMessage(error: any, defaultMessage: string = "An error occurred") {
  const getMessage = (errorItem: any) => {
    return isError(errorItem)
      ? errorItem.message
      : isString(errorItem)
      ? errorItem
      : defaultMessage;
  };

  return isArray(error) ? getMessage(error[1]) : getMessage(error);
}
