import { createReducer } from "@reduxjs/toolkit";
import SessionActions from "../session/actions";
import KeyValueActions from "./actions";
import { IKeyValueState } from "./types";

const keyValueReducer = createReducer<IKeyValueState>({}, (builder) => {
  builder.addCase(KeyValueActions.setKey, (state, action) => {
    const key = action.payload.key;
    const value = action.payload.value;
    state[key] = value;
  });

  builder.addCase(KeyValueActions.deleteKey, (state, action) => {
    const key = action.payload;
    delete state[key];
  });

  builder.addCase(SessionActions.logoutUser, (state) => {
    state = {};
  });
});

export default keyValueReducer;
