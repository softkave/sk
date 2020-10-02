import get from "lodash/get";
import mergeWith from "lodash/mergeWith";
import set from "lodash/set";
import { isMoment, Moment } from "moment";
import { indexArray } from "./object";

const tempPrefix = "temp-";

const uuid = require("uuid/v4");
// const getNewId = require("nanoid");

export function getNewId() {
    return uuid();
}

export function getNewTempId(id?: string) {
    return `${tempPrefix}${id || getNewId()}`;
}

export function isTempId(id: string, matchId?: string) {
    const hasTempPrefix = id.startsWith(tempPrefix);

    if (hasTempPrefix && matchId) {
        return id.endsWith(matchId);
    }

    return hasTempPrefix;
}

export function getDateString(initial?: Date | string | number | Moment) {
    if (initial) {
        return new Date(
            isMoment(initial) ? initial.valueOf() : initial
        ).toISOString();
    }

    return new Date().toISOString();
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

    return indexArray(errors as any[], {
        indexer: (next) => {
            if (next.field) {
                return next.field;
            } else {
                return "error";
            }
        },
        reducer: (value, existing) => {
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

export interface IMergeDataMeta {
    arrayUpdateStrategy?: "merge" | "concat" | "replace";
}

export const mergeData = <ResourceType = any>(
    resource: ResourceType,
    data: Partial<ResourceType>,
    meta: IMergeDataMeta = { arrayUpdateStrategy: "concat" }
) => {
    return mergeWith(resource, data, (objValue, srcValue) => {
        if (Array.isArray(objValue) && srcValue) {
            if (meta.arrayUpdateStrategy === "concat") {
                return objValue.concat(srcValue);
            } else if (meta.arrayUpdateStrategy === "replace") {
                return srcValue;
            }

            // No need to handle the "merge" arrayUpdateStrategy, it happens by default
            // if nothing is returned
        }
    });
};
