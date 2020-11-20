import dotProp from "dot-prop-immutable";
import get from "lodash/get";
import isObject from "lodash/isObject";
import mergeWith from "lodash/mergeWith";
import set from "lodash/set";
import { isMoment, Moment } from "moment";
import { IAppError } from "../net/types";
import cast from "./cast";

const tempPrefix = "temp-";

const uuid = require("uuid/v4");
// export const getNewId = require("nanoid");
export const getNewId = uuid;

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

const defaultFormErrorFieldName = "error";

export const flattenErrorList = (
    errors: IAppError[]
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
        const field = error.field || defaultFormErrorFieldName;
        let errs = get(err, field);

        if (Array.isArray(errs)) {
            errs.push(error.message);
            return;
        }

        let prev = "";
        const fieldPath = field.split(".");
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
        return JSON.stringify(get(data, path));
    }

    return JSON.stringify(data);
}

function defaultReducer(data: any) {
    return data;
}

export type ArrayItemIndex = string;
export type ArrayItemIndexer<T> = (
    current: T,
    path: (T extends object ? keyof T : never) | undefined,
    arr: T[],
    index: number
) => ArrayItemIndex | undefined;

export type ArrayItemReducer<T, R> = (current: T, arr: T[], index: number) => R;

export interface IIndexArrayOptions<T, R> {
    path?: T extends object ? keyof T : never;
    indexer?: ArrayItemIndexer<T>;
    reducer?: ArrayItemReducer<T, R>;
}

export function indexArray<T, R = T>(
    arr: T[] = [],
    opts: IIndexArrayOptions<T, R> = {}
): { [key: string]: R } {
    const indexer = opts.indexer || defaultIndexer;
    const path = opts.path;
    const reducer = opts.reducer || defaultReducer;

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

export function getMsForwardFrom(data: string) {
    return Date.now() - getDate(data).valueOf();
}

export function getBackwardMsFrom(data: string) {
    return getDate(data).valueOf() - Date.now();
}

export type MultipleIndexerFnResult<IndexLabel = string> = Array<{
    key: ArrayItemIndex;
    label: IndexLabel;
}>;

type MultipleIndexerObjectPaths<T extends object, IndexLabel = string> = Array<{
    path: keyof T;
    label: IndexLabel;
}>;

function scalarItemIndexer(data: any): MultipleIndexerFnResult {
    const dataStr = JSON.stringify(data);

    return [
        {
            key: dataStr,
            label: dataStr,
        },
    ];
}

function mapItemIndexer<T extends object, IndexLabel extends string = string>(
    data: T,
    paths: MultipleIndexerObjectPaths<T, IndexLabel>
): MultipleIndexerFnResult {
    return paths.map((path) => ({
        key: JSON.stringify(get(data, path.path)),
        label: path.label,
    }));
}

function chooseDefaultIndexer<T>(data: T[]) {
    if (data.length > 0 && isObject(data[0])) {
        return mapItemIndexer;
    }

    return scalarItemIndexer;
}

export interface IMultipleIndexesOptions<
    T,
    R,
    IndexLabel extends string = string,
    P = T extends object
        ? MultipleIndexerObjectPaths<T, IndexLabel>
        : IndexLabel[]
> {
    paths?: P;
    indexer?: (
        current: T,
        paths: P,
        arr: T[],
        index: number
    ) => MultipleIndexerFnResult<IndexLabel> | undefined;
    reducer?: (current: T, arr: T[], index: number) => R;
}

type Indexes<R, IndexLabel extends string> = Record<
    IndexLabel,
    Record<ArrayItemIndex, R>
>;

class IndexesHelper<R, IndexLabel extends string> {
    private indexes: Indexes<R, IndexLabel> = {} as any;
    private indexLabels: string[] = [];

    constructor(indexes: Indexes<R, IndexLabel>) {
        this.indexes = indexes;
        this.indexLabels = Object.keys(indexes);
    }

    public getItem(key: ArrayItemIndex, label?: IndexLabel): R | undefined {
        if (label) {
            const index = this.indexes[label];

            if (!index) {
                return;
            }

            return index[key];
        }

        // tslint:disable-next-line: forin
        for (const indexLabel in this.indexLabels) {
            const index = this.indexes[indexLabel];

            if (index[key]) {
                return index[key];
            }
        }
    }
}

export function multipleIndexes<T, R = T, IndexLabel extends string = string>(
    arr: T[] = [],
    opts: IMultipleIndexesOptions<T, R, IndexLabel> = {}
): IndexesHelper<R, IndexLabel> {
    const indexer = opts.indexer || chooseDefaultIndexer(arr);
    const paths = opts.paths || [];
    const reducer = opts.reducer || defaultReducer;

    const indexes = arr.reduce((accumulator, current, num) => {
        const keys = indexer(current as any, paths as any, arr, num);

        if (!keys || keys.length === 0) {
            return accumulator;
        }

        const reducedItem = reducer(current, arr, num);

        keys.forEach((key) => {
            const index = accumulator[key.label] || {};
            index[key.key] = reducedItem;
            accumulator[key.label] = index;
        });

        return accumulator;
    }, cast<Indexes<R, IndexLabel>>({}));

    return new IndexesHelper(indexes);
}
