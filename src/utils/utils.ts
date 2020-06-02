import get from "lodash/get";
import set from "lodash/set";
import { indexArray } from "./object";

const uuid = require("uuid/v4");
// const getId = require("nanoid");

export function newId() {
  return uuid();
}

export function getDateString() {
  return new Date().toString();
}

export const pluralize = (str: string) => {
  return `${str}s`;
};

export const flattenErrorListWithDepthOne = (
  errors: any
): { [key: string]: string[] } => {
  if (!errors) {
    return {};
  }

  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  if (errors.length === 0) {
    return {};
  }

  return indexArray(errors, {
    indexer: (next) => {
      if (next.field) {
        return next.field;
      } else {
        return "error";
      }
    },
    proccessValue: (value, existing) => {
      if (existing) {
        existing.push(value.message);
        return existing;
      } else {
        return [value.message];
      }
    },
  });
};

export const flattenErrorListWithDepthInfinite = (
  errors: any
): { [key: string]: any } => {
  if (!errors) {
    return {};
  }

  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  if (errors.length === 0) {
    return {};
  }

  const err = {};
  const cachedFields = {};

  errors.forEach((error) => {
    const field = error.field || "error";
    let errs: any = get(err, field);

    if (errs) {
      errs.push(error.message);
      return;
    }

    const fieldPath = field.split(".");
    let prev = "";
    const parentExists = fieldPath.find((path) => {
      prev = [prev, path].join(".");

      if (cachedFields[prev]) {
        return true;
      }

      return false;
    });

    if (!parentExists) {
      errs = [error.message];
      set(err, field, errs);
    }
  });

  return err;
};

// tslint:disable-next-line: no-empty
export const noop = () => {};
