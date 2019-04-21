import {
  MERGE,
  DELETE,
  MULTIPLE,
  SET,
  CLEAR_STATE
} from "../constants/reducer";

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

export function makeSet(path, data) {
  return {
    path,
    data,
    type: SET
  };
}

export function makeClearState() {
  return {
    type: CLEAR_STATE
  };
}
