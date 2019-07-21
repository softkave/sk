import dotProp from "dot-prop-immutable";

export function getDataFromObject(obj, dataArr, addEmpty) {
  let result = {};

  dataArr.forEach(field => {
    let data = dotProp.get(obj, field);

    if ((data !== null && data !== undefined) || addEmpty) {
      result[field] = data;
    }
  });

  return result;
}

function defaultIndexer(data, path) {
  if (path) {
    return dotProp.get(data, path);
  }

  return JSON.stringify(data);
}

export function indexArray(arr = [], { path, indexer } = {}) {
  if (typeof indexer !== "function") {
    indexer = defaultIndexer;
  }

  let result = arr.reduce((accumulator, current) => {
    accumulator[indexer(current, path, arr)] = current;
    return accumulator;
  }, {});

  return result;
}
