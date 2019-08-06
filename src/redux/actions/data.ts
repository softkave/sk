import { makeClearState, makeDelete, makeMerge, makeSet } from "./make";

export function mergeDataByPath(path: string, data: any) {
  return makeMerge(path, data);
}

export function deleteDataByPath(path: string) {
  return makeDelete(path);
}

export function setDataByPath(path: string, data: any) {
  return makeSet(path, data);
}

export function clearState() {
  return makeClearState();
}
