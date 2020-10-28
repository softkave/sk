import React from "react";

export interface IUseObjectHookProps<T extends object = object> {
    initialValues?: T;
}

type Iterator<T extends object> = (v: T[keyof T], k: keyof T, obj: T) => void;

export interface IUseObjectHookResult<T extends object> {
    set: (key: keyof T, item: any) => void;
    merge: (obj: T) => void;
    remove: (key: keyof T) => boolean;
    has: (key: keyof T) => boolean;
    clear: () => void;
    setObject: (val: T) => void;
    get: (key: keyof T) => T[keyof T];
    getObject: () => T;
    forEach: (iter: Iterator<T>) => void;
    size: () => number;
}

const useObject = <T extends object>(
    props: IUseObjectHookProps<T> = {}
): IUseObjectHookResult<T> => {
    const [obj, setObject] = React.useState(props.initialValues || ({} as T));

    const remove = (key: keyof T) => {
        const newObj = { ...obj };
        const itemExists = exists(key);

        delete newObj[key];
        setObject(newObj);

        return itemExists;
    };

    const exists = (key: keyof T) => {
        return !!obj[key];
    };

    const add = (key: keyof T, item: T[keyof T]) => {
        const newObj = { ...obj };
        newObj[key] = item;
        setObject(newObj);
    };

    const reset = () => setObject(props.initialValues || ({} as T));

    const get = (key: keyof T) => obj[key];

    const getObject = () => obj;

    const forEachLoop = (iter: Iterator<T>) => {
        // tslint:disable-next-line: forin
        for (const key in obj) {
            const data = obj[key];
            iter(data, key, obj);
        }
    };

    const size = () => Object.keys(obj).length;

    const merge = (data: T) => {
        const newObj = { ...obj, ...data };
        setObject(newObj);
    };

    return {
        remove,
        clear: reset,
        set: add,
        has: exists,
        get,
        getObject,
        setObject,
        size,
        merge,
        forEach: forEachLoop,
    };
};

export default useObject;
