import { createReducer } from "@reduxjs/toolkit";
import { deleteKeyValue, setKeyValue } from "./actions";

export interface IKeyValueState {
  [key: string]: boolean | number | string | object;
}

export const keyValueReducer = createReducer({}, (builder) => {
  builder.addCase(setKeyValue, (state, action) => {
    const key = action.payload[0];
    const value = action.payload[1];
    state[key] = value;
  });

  builder.addCase(deleteKeyValue, (state, action) => {
    const key = action.payload;
    delete state[key];
  });
});

export enum KeyValueProperties {
  CachedOrgPath = "cachedOrgPath",
}
