import { MERGE, DELETE, MULTIPLE } from "../constants/reducer";

export function makeMerge(path, data) {
  return {
    data,
    path,
    type: MERGE
  };
}

export function makeDelete(path) {
  return {
    path,
    type: DELETE
  };
}

export function makeMultiple(actions) {
  return {
    actions,
    type: MULTIPLE
  };
}
