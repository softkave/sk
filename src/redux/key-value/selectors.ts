import { IAppState } from "../types";

export function getKeyValue(state: IAppState, key: string) {
  return state.keyValue[key];
}

export default class KeyValueSelectors {
  public static getKey = getKeyValue;
}
