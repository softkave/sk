import assert from "assert";
import { IAppState } from "../types";

function getKeyValue<T = any>(state: IAppState, key: string): T | undefined {
  return state.keyValue[key];
}

function assertGetKeyValue<T = any>(state: IAppState, key: string): T {
  const item = getKeyValue<T>(state, key);
  assert(item);
  return item;
}

function getManyKeyValue(state: IAppState, keys: string[]) {
  return keys.map((key) => {
    return state.keyValue[key];
  });
}

export default class KeyValueSelectors {
  static getByKey = getKeyValue;
  static assertGetByKey = assertGetKeyValue;
  static getMany = getManyKeyValue;
}
