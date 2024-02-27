import dotProp from "dot-prop-immutable";
import { compact, defaultTo, isArray, merge } from "lodash";
import get from "lodash/get";
import isObject from "lodash/isObject";
import mergeWith from "lodash/mergeWith";
import set from "lodash/set";
import { Moment, isMoment } from "moment";
import { IResourceWithId } from "../models/types";
import cast from "./cast";
import { IAppError } from "./errors";
import { AnyObject, IUpdateComplexTypeArrayInput } from "./types";

const DEFAULT_FORM_ERROR_FIELD_NAME = "error";

export function reverseMap<K extends string, V extends string>(m: Record<K, V>): Record<V, K> {
  const r: Record<V, K> = cast<Record<V, K>>({});
  for (const k in m) {
    r[m[k]] = k;
  }
  return r;
}

export function getDateString(initial?: Date | string | number | Moment) {
  if (initial) {
    return new Date(isMoment(initial) ? initial.valueOf() : initial).toISOString();
  }

  return new Date().toISOString();
}

export const pluralize = (str: string, count: number = 2) => {
  return `${str}${count === 1 ? "" : "s"}`;
};

export type FlattenedError<T extends object = object, E extends string | string[] = string[]> = {
  [K in keyof T]?: NonNullable<T[K]> extends Array<infer T1>
    ? NonNullable<T1> extends object
      ? Array<FlattenedError<NonNullable<T1>>>
      : E
    : NonNullable<T[K]> extends object
    ? FlattenedError<NonNullable<T[K]>>
    : E;
} & { error?: E };

export const flattenErrorList = <T extends AnyObject = AnyObject>(
  errors: IAppError[],
  firstErrorOnly = false
): Partial<T> => {
  if (!errors) return {};
  if (errors.length === 0) return {};

  const mappedError = {};

  const getDotLength = (p: string = DEFAULT_FORM_ERROR_FIELD_NAME) => {
    return defaultTo(p, DEFAULT_FORM_ERROR_FIELD_NAME).split(".").length;
  };

  const getChildrenErrorExists = (field: string) => {
    const children = get(mappedError, field);
    return isObject(children);
  };

  const setError = (field: string, errorList: any, errorMessage: string) => {
    if (firstErrorOnly) {
      set(mappedError, field, errorMessage);
    } else if (Array.isArray(errorList)) {
      // Error list already set, only add the new error message
      errorList.push(errorMessage);
    } else {
      errorList = [errorMessage];
      set(mappedError, field, errorList);
    }
  };

  // Sort the errors with fields that subclass other fields (like `first.second`
  // subclassing `first.second.third`) coming after, and the subclassed coming
  // before.
  errors.sort(
    (e1, e2) =>
      (getDotLength(e1.field) - getDotLength(e2.field)) *
      /** Multiply by -1 to reverse ascendancy */ -1
  );
  errors.forEach((error) => {
    const field = error.field || DEFAULT_FORM_ERROR_FIELD_NAME;
    const errorList = get(mappedError, field);
    if (errorList) {
      setError(field, errorList, error.message);
    } else {
      /**
       * We only want to set a field's error if it doesn't contain any children
       * error, basically prioritzing deep errors over shallow ones. For
       * example, if evaluating fields `first.second.third` and `first.second`,
       * and both have errors, only `first.second.third` is going to be included
       * in the flattened errors map because `first.second` subclasses
       * `first.second.third`.
       */
      const childrenExist = getChildrenErrorExists(field);
      if (!childrenExist) {
        setError(field, errorList, error.message);
      }
    }
  });

  return mappedError as T;
};

export function replaceErrorListPaths(errorList: IAppError[], f: string | RegExp, r: string) {
  return errorList.map((item) => ({
    ...item,
    field: item.field?.replace(f, r),
  }));
}

export interface IMergeDataMeta {
  /**
   * `merge` - Lodash's default, check out Lodash's `mergeWith` for details.
   * `concat` - Joins both arrays, returning a new array.
   * `replace` - Replaces the old array with the new array value.
   * `retain` - Retains the old array value.
   */
  arrayUpdateStrategy: "merge" | "concat" | "replace" | "retain";
}

export interface IMergeDataMetaExported {
  meta?: IMergeDataMeta;
}

export const mergeData = <ResourceType = any>(
  resource: ResourceType,
  data: Partial<ResourceType>,
  meta: IMergeDataMeta = { arrayUpdateStrategy: "replace" }
) => {
  const result = mergeWith(resource, data, (objValue, srcValue) => {
    if (Array.isArray(objValue) && srcValue) {
      if (meta.arrayUpdateStrategy === "concat") {
        return objValue.concat(srcValue);
      } else if (meta.arrayUpdateStrategy === "replace") {
        return srcValue;
      } else if (meta.arrayUpdateStrategy === "retain") {
        return objValue;
      }

      // No need to handle the "merge" arrayUpdateStrategy, it happens by
      // default if nothing is returned
    }
  });

  return result;
};

export function getDate(initial?: any) {
  if (initial) {
    const date = new Date(initial);
    return date;
  }

  return new Date();
}

export function getDataFromObject(obj: object, fields: string[], addEmpty?: boolean) {
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

  return data;
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
  if (!searchQuery) return list;

  const lowerCasedSearchQuery = searchQuery.toLowerCase();
  return list.filter((block) => {
    const fieldValue = block[field];
    if (fieldValue) {
      return (fieldValue as unknown as string).toLowerCase().includes(lowerCasedSearchQuery);
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
    key: cast<string>(get(data, path.path)),
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
  P = T extends object ? MultipleIndexerObjectPaths<T, IndexLabel> : IndexLabel[]
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

type Indexes<R, IndexLabel extends string> = Record<IndexLabel, Record<ArrayItemIndex, R>>;

class IndexesHelper<R, IndexLabel extends string> {
  private indexes: Indexes<R, IndexLabel> = {} as any;
  private indexLabels: string[] = [];

  constructor(indexes: Indexes<R, IndexLabel>) {
    this.indexes = indexes;
    this.indexLabels = Object.keys(indexes);
  }

  getItem(key: ArrayItemIndex, label?: IndexLabel): R | undefined {
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

export function formikErrorsToTouched(errors) {
  if (isArray(errors)) {
    return errors.map(formikErrorsToTouched);
  } else if (isObject(errors)) {
    return Object.keys(errors).reduce((obj, key) => {
      obj[key] = formikErrorsToTouched(errors[key]);
      return obj;
    }, {});
  } else {
    return true;
  }
}

export function formikHasError(errors) {
  if (isArray(errors)) {
    return !!errors.find(formikHasError);
  } else if (isObject(errors)) {
    return !!Object.keys(errors).find((key) => {
      return formikHasError(errors[key]);
    });
  } else if (!!errors) {
    return true;
  }

  return false;
}

export function topLevelDiff(o1: object, o2: object) {
  const k1 = Object.keys(o1);
  const o4 = k1.reduce((o3, key) => {
    const v1 = o1[key];
    const v2 = o2[key];
    const t1 = typeof v1;
    const t2 = typeof v2;

    if (t1 !== t2) {
      o3[key] = v1;
    } else if (t1 === "object" && v1 !== null && Object.keys(v1).length > 0) {
      o3[key] = v1;
    } else if (v1 !== v2) {
      o3[key] = v1;
    }

    return o3;
  }, {});

  return o4;
}

export function stripEmpty<T extends object>(o1: T) {
  const k1 = Object.keys(o1);
  const o4 = k1.reduce((o3, key) => {
    const v1 = o1[key];
    const t1 = typeof v1;

    if (t1 === "object" && Object.keys(v1).length > 0) {
      o3[key] = v1;
    } else if (!!v1) {
      o3[key] = v1;
    }

    return o3;
  }, {} as T);

  return o4;
}

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function loopWithMaxCycles<T>(
  items: T[],
  cycleMax: number,
  fn: (item: T, index: number) => boolean | undefined
) {
  let cycles = 0;
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    const increment = fn(item, i);

    if (increment) {
      cycles++;
    }

    if (cycles >= cycleMax) {
      return i;
    }
  }

  return items.length;
}

export function updateWithMaxCycles<T>(
  items: T[],
  cycleMax: number,
  fn: (item: T, index: number) => T | undefined
) {
  loopWithMaxCycles(items, cycleMax, (item, i) => {
    const processed = fn(item, i);

    if (processed) {
      items[i] = processed;
      return true;
    }
  });
}

export function filterWithMaxCycles<T>(
  items: T[],
  cycleMax: number,
  fn: (item: T, index: number) => boolean | undefined
) {
  let filtered: T[] = [];
  const end = loopWithMaxCycles(items, cycleMax, (item, i) => {
    const shouldKeep = fn(item, i);

    if (shouldKeep) {
      filtered.push(item);
      return true;
    }
  });

  if (end < items.length) {
    filtered = filtered.concat(items.slice(end + 1));
  }

  return filtered;
}

export function processComplexTypeInput<T, Update, Add = Update>(
  items: T[],
  input: IUpdateComplexTypeArrayInput<Update, Add>,
  key: keyof Update | null,
  addFn: (item02: Add) => T,
  updateFn: (item01: T, item02: Update) => T = (item01: T, item02: Update) => {
    return cast<T>(
      isObject(item01)
        ? merge({}, item01, item02)
        : isArray(item01)
        ? merge([], item01, item02)
        : item02
    );
  }
) {
  if (input.add) {
    items = [...items];
    input.add.forEach((item) => {
      items.push(addFn(item));
    });
  }

  if (input.update) {
    const updateMap = indexArray(input.update, {
      indexer: (item) => (key ? get(item, key) : item),
    });

    updateWithMaxCycles(items, input.update.length, (item) => {
      const itemUpdate = updateMap[key ? get(item, key) : item];

      if (itemUpdate) {
        return updateFn(item, itemUpdate);
      }
    });
  }

  if (input.remove) {
    const removeMap = indexArray(input.remove);
    items = filterWithMaxCycles(items, input.remove.length, (item) => {
      return !!removeMap[key ? get(item, key) : item];
    });
  }

  return items;
}

export function notImplementedYet() {
  throw new Error("Method not implemented yet!");
}

export function checkArgExists<T>(
  d?: T,
  error: Error = new Error("data not provided")
): NonNullable<T> {
  if (!d) {
    throw error;
  }
  return d as NonNullable<T>;
}

export function assertArg(d?: any, error: Error = new Error("data not provided")): asserts d {
  if (!d) {
    throw error;
  }
}

export function makeKey(fields: any[], separator = "-", omitFalsy = true) {
  if (omitFalsy) fields = compact(fields);
  return fields.join(separator);
}

export function clone<T>(obj: T, extra?: Partial<T>) {
  return merge({}, obj, extra);
}

export function indexByCustomId(r: IResourceWithId) {
  return r.customId;
}

export function extractCustomIdList(r: Array<IResourceWithId>) {
  return r.map(indexByCustomId);
}
