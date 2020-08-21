import { createReducer } from "@reduxjs/toolkit";
import SessionActions from "../session/actions";
import KeyValueActions from "./actions";
import { IKeyValueState, KeyValueKeys } from "./types";

const def = {
  [KeyValueKeys.AppMenu]: true,
  [KeyValueKeys.OrgMenu]: true,
};

const keyValueReducer = createReducer<IKeyValueState>(
  {
    ...def,
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

    builder.addCase(KeyValueActions.pushRoom, (state, action) => {
      const rooms = state[KeyValueKeys.Rooms] || {};
      rooms[action.payload] = true;
      state[KeyValueKeys.Rooms] = rooms;
    });

    builder.addCase(KeyValueActions.removeRoom, (state, action) => {
      const rooms = state[KeyValueKeys.Rooms] || {};
      delete rooms[action.payload];
      state[KeyValueKeys.Rooms] = rooms;
    });

    builder.addCase(SessionActions.logoutUser, (state) => {
      return {};
    });

    builder.addCase(SessionActions.loginUser, (state) => {
      Object.keys(def).forEach((key) => {
        state[key] = def[key];
      });
    });
  }
);

export default keyValueReducer;
