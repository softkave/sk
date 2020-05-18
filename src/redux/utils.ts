import isString from "lodash/isString";
import { INetError } from "../net/query";

export const errorToObject = (err: Error | INetError | string): INetError => {
  const error = isString(err) ? new Error(err) : err;

  return {
    name: error.name,
    message: error.message,
    action: (error as any).action,
    field: (error as any).field,
  };
};

export const normalizeErrors = (err: any) => {
  if (Array.isArray(err)) {
    return err.map((error) => errorToObject(error));
  } else {
    return errorToObject(err);
  }
};
