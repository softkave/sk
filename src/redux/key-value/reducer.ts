import { createReducer } from "@reduxjs/toolkit";
import SessionActions from "../session/actions";
import KeyValueActions from "./actions";
import { IKeyValueState, KeyValueKeys } from "./types";

const keyValueReducer = createReducer<IKeyValueState>(
  {
    [KeyValueKeys.AppMenu]: true,
    [KeyValueKeys.OrgMenu]: true,
  },
  (builder) => {
    builder.addCase(KeyValueActions.setKey, (state, action) => {
      const key = action.payload.key;
      const value = action.payload.value;
      state[key] = value;
    });

    builder.addCase(KeyValueActions.setValues, (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        const value = action.payload[key];
        state[key] = value;
      });
    });

    builder.addCase(KeyValueActions.deleteKey, (state, action) => {
      const key = action.payload;
      delete state[key];
    });

    builder.addCase(SessionActions.logoutUser, (state) => {
      return {};
    });
  }
);

export default keyValueReducer;
