import dotProp from "dot-prop-immutable";
import get from "lodash/get";
import mergeWith from "lodash/mergeWith";
import set from "lodash/set";
import { isMoment, Moment } from "moment";

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

export function getDate(initial?: any) {
    if (initial) {
        const date = new Date(initial);
        return date;
    }

    return new Date();
}

export function getDataFromObject(
    obj: object,
    fields: string[],
    addEmpty?: boolean
) {
    const result = {};

    fields.forEach((field) => {
        const data = dotProp.get(obj, field);

        if (data !== undefined || addEmpty) {
            result[field] = data;
        }
    });

    return result;
}

function defaultIndexer(data: any, path: any) {
    if (path) {
        return get(data, path);
    }

    return JSON.stringify(data);
}

function defaultReducer(data: any) {
    return data;
}

export interface IIndexArrayOptions<T, R> {
    path?: T extends object ? keyof T : never;
    indexer?: (
        current: T,
        path: (T extends object ? keyof T : never) | undefined,
        arr: T[],
        index: number
    ) => string | undefined;
    reducer?: (current: T, arr: T[], index: number) => R;
}

export function indexArray<T, R = T>(
    arr: T[] = [],
    opts: IIndexArrayOptions<T, R> = {}
): { [key: string]: R } {
    const indexer = opts.indexer || defaultIndexer;
    const path = opts.path;
    const reducer = opts.reducer || defaultReducer;

    if (typeof indexer !== "function") {
        if (typeof path !== "string") {
            throw new Error(
                "Path must be provided if an indexer is not provided"
            );
        }
    }

    const result = arr.reduce((accumulator, current, index) => {
        const key = indexer(current, path, arr, index);

        if (!key) {
            return accumulator;
        }

        accumulator[key] = reducer(current, arr, index);

        return accumulator;
    }, {});

    return result;
}

export function filterObjectList<T extends object = object>(
    list: T[],
    field: keyof T,
    searchQuery?: string
) {
    if (!searchQuery) {
        return list;
    }

    const lowerCasedSearchQuery = searchQuery.toLowerCase();

    return list.filter((block) => {
        const fieldValue = block[field];

        if (fieldValue) {
            return ((fieldValue as unknown) as string)
                .toLowerCase()
                .includes(lowerCasedSearchQuery);
        }

        return false;
    });
}
