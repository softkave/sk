import dotProp from "dot-prop-immutable";
import get from "lodash/get";
import set from "lodash/set";

export function getDataFromObject(
  obj: object,
  dataArr: string[],
  addEmpty?: boolean
) {
  const result = {};

  dataArr.forEach(field => {
    const data = dotProp.get(obj, field);

    if ((data !== null && data !== undefined) || addEmpty) {
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
  indexer?: (current: any, path: string, arr: any[]) => string | number;
  proccessValue?: (
    current: any,
    existing: any,
    path: string,
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

  const result = arr.reduce((accumulator, current) => {
    const index = indexer!(current, path!, arr);
    const existing = get(accumulator, index);
    const value = proccessValue!(current, existing, path!, arr);
    set(accumulator, index, value);
    return accumulator;
  }, {});

  return result;
}
