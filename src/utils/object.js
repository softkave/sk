import dotProp from "dot-prop-immutable";

export function getDataFromObj(obj, dataArr, addEmpty) {
  let result = {};

  dataArr.forEach(field => {
    let data = dotProp.get(obj, field);

    if (data || addEmpty) {
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

export function indexArray(arr = [], { path, indexer = defaultIndexer } = {}) {
  let result = arr.reduce((accumulator, current) => {
    accumulator[indexer(current, path, arr)] = current;
    return accumulator;
  }, {});

  return result;
}
