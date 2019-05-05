import { makeMerge, makeDelete, makeSet, makeClearState } from "./make";

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
