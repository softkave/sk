import {
  makeMultiple,
  makeMerge,
  makeDelete,
  makeSet,
  makeClearState
} from "./make";

export function updateId(data, newId, prevId) {
  const action1 = makeDelete(data.path);
  data.id = newId;
  let prevPath = data.path.split(".");
  prevPath.pop();
  prevPath.push(newId);
  data.path = prevPath.join(".");
  return makeMultiple([action1, makeMerge(data.path, data)]);
}

export function mergeDataByPath(path, data) {
  return makeMerge(path, data);
}

export function deleteDataByPath(path) {
  return makeDelete(path);
}

export function setDataByPath(path, data) {
  return makeSet(path, data);
}

export function clearState() {
  return makeClearState();
}
