import forEach from "lodash/forEach";
import React from "react";

export interface IUseObjectHookProps {
    initialValues?: object;
}

type Iterator = (v: any, k: string, obj: object) => void;
export interface IUseObjectHookResult {
    set: (key: string, item: any) => void;
    merge: (obj: object) => void;
    remove: (key: string) => boolean;
    has: (key: string) => boolean;
    clear: () => void;
    setObject: (val: object) => void;
    get: (key: string) => object;
    getObject: () => object;
    forEach: (iter: Iterator) => void;
    size: () => number;
}

const useObject = (props: IUseObjectHookProps = {}): IUseObjectHookResult => {
    const [obj, setObject] = React.useState(props.initialValues || {});

    const remove = (key: string) => {
        const newObj = { ...obj };
        const itemExists = exists(key);

        delete newObj[key];
        setObject(newObj);

        return itemExists;
    };

    const exists = (key: string) => {
        return !!obj[key];
    };

    const add = (key: string, item: any) => {
        const newObj = { ...obj };
        newObj[key] = item;
        setObject(newObj);
    };

    const reset = () => setObject(props.initialValues || {});

    const get = (key: string) => obj[key];

    const getObject = () => obj;

    const forEachLoop = (iter: Iterator) => forEach(obj, iter);

    const size = () => Object.keys(obj).length;

    const merge = (data: object) => {
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
