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
  set: (list: T[]) => void;
  get: (index: number) => T;
}

const useArray = <T>(
  props: IUseArrayHookProps<T> = {}
): IUseArrayHookResult<T> => {
  const [list, setList] = React.useState(props.initialValues || []);
  const find = props.find || ((item, next) => item === next);

  const removeIndex = (i: number) => {
    if (i >= 0) {
      const newList = [...list];
      newList.splice(i, 1);
      setList(newList);
    }

    return i >= 0;
  };

  const remove = (item: T) => {
    const i = list.findIndex((next) => find(item, next));
    return removeIndex(i);
  };

  const exists = (item: T) => list.findIndex((next) => find(item, next)) >= 0;

  const add = (item: T) => {
    const newList = [...list];
    newList.unshift(item);
    setList(newList);
  };

  const reset = () => setList(props.initialValues || []);

  const get = (i: number) => list[i];

  return {
    remove,
    removeIndex,
    reset,
    add,
    exists,
    get,
    set: setList,
  };
};

export default useArray;
