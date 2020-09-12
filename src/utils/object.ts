import dotProp from "dot-prop-immutable";
import get from "lodash/get";
import set from "lodash/set";

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

function defaultIndexer(data: object, path: string) {
    if (path) {
        return dotProp.get(data, path);
    }

    return JSON.stringify(data);
}

function defaultProcessValue(value: any) {
    return value;
}

interface IIndexArrayOptions {
    path?: string;
    indexer?: (
        current: any,
        providedPath: string,
        currentIndex: number,
        arr: any[]
    ) => string | number;
    proccessValue?: (
        current: any,
        existing: any,
        providedPath: string,
        currentIndex: number,
        arr: any[]
    ) => any;
}

export function indexArray(
    arr: any[] = [],
    { path, indexer, proccessValue }: IIndexArrayOptions = {}
) {
    if (typeof indexer !== "function") {
        indexer = defaultIndexer;
    }

    proccessValue = proccessValue || defaultProcessValue;

    const result = arr.reduce((accumulator, current, reduceIndex) => {
        const index = indexer!(current, path!, reduceIndex, arr);
        const existing = get(accumulator, index);
        const value = proccessValue!(
            current,
            existing,
            path!,
            reduceIndex,
            arr
        );
        set(accumulator, index, value);
        return accumulator;
    }, {});

    return result;
}
