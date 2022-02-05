import React from "react";

export interface IUseArrayHookProps<T> {
  initialValues?: T[];
  find?: (item: T, next: T) => boolean;
}

export interface IUseArrayHookResult<T> {
  add: (item: T) => void;
  remove: (item: T) => boolean;
  removeIndex: (i: number) => boolean;
  exists: (item: T) => boolean;
  reset: () => void;
  setList: (list: T[]) => void;
  get: (index: number) => T;
  getList: () => T[];
}

const defaultFind = (item, next) => item === next;
const useArray = <T>(
  props: IUseArrayHookProps<T> = {}
): IUseArrayHookResult<T> => {
  const [list, setList] = React.useState(props.initialValues || []);
  const find = props.find || defaultFind;
  const removeIndex = React.useCallback(
    (i: number) => {
      if (i >= 0) {
        const newList = [...list];
        newList.splice(i, 1);
        setList(newList);
      }

      return i >= 0;
    },
    [list]
  );

  const remove = React.useCallback(
    (item: T) => {
      const i = list.findIndex((next) => find(item, next));
      return removeIndex(i);
    },
    [list, find, removeIndex]
  );

  const exists = React.useCallback(
    (item: T) => list.findIndex((next) => find(item, next)) >= 0,
    [list, find]
  );

  const add = React.useCallback(
    (item: T) => {
      const newList = [...list];
      newList.unshift(item);
      setList(newList);
    },
    [list]
  );

  const reset = React.useCallback(
    () => setList(props.initialValues || []),
    [props.initialValues]
  );

  const get = React.useCallback((i: number) => list[i], [list]);
  const getList = React.useCallback(() => list, [list]);
  return {
    remove,
    removeIndex,
    reset,
    add,
    exists,
    get,
    getList,
    setList,
  };
};

export default useArray;
