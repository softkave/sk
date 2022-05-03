import { IAppState } from "../types";

function getKeyValue<T = any>(state: IAppState, key: string): T {
  return state.keyValue[key];
}

export default class KeyValueSelectors {
  public static getKey = getKeyValue;
}
