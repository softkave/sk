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

  const exists = React.useCallback(
    (key: keyof T) => {
      return !!obj[key];
    },
    [obj]
  );

  const remove = React.useCallback(
    (key: keyof T) => {
      const newObj = { ...obj };
      const itemExists = exists(key);
      delete newObj[key];
      setObject(newObj);
      return itemExists;
    },
    [obj, exists]
  );

  const add = React.useCallback(
    (key: keyof T, item: T[keyof T]) => {
      const newObj = { ...obj };
      newObj[key] = item;
      setObject(newObj);
    },
    [obj]
  );

  const reset = React.useCallback(
    () => setObject(props.initialValues || ({} as T)),
    [props.initialValues]
  );

  const get = React.useCallback((key: keyof T) => obj[key], [obj]);
  const getObject = React.useCallback(() => obj, [obj]);
  const forEachLoop = React.useCallback(
    (iter: Iterator<T>) => {
      // tslint:disable-next-line: forin
      for (const key in obj) {
        const data = obj[key];
        iter(data, key, obj);
      }
    },
    [obj]
  );

  const size = React.useCallback(() => Object.keys(obj).length, [obj]);
  const merge = React.useCallback(
    (data: T) => {
      const newObj = { ...obj, ...data };
      setObject(newObj);
    },
    [obj]
  );

  const funcs = React.useMemo(
    () => ({
      remove,
      get,
      getObject,
      setObject,
      size,
      merge,
      clear: reset,
      set: add,
      has: exists,
      forEach: forEachLoop,
    }),
    [
      remove,
      reset,
      add,
      exists,
      get,
      getObject,
      setObject,
      size,
      merge,
      forEachLoop,
    ]
  );

  return funcs;
};

export default useObject;
