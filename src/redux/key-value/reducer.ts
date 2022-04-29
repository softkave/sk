import { createReducer } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import SessionActions from "../session/actions";
import KeyValueActions from "./actions";
import { IKeyValueState, KeyValueKeys } from "./types";

const def = {
  [KeyValueKeys.ShowAppMenu]: true,
  [KeyValueKeys.ShowOrgMenu]: true,
  [KeyValueKeys.UnseenChatsCountByOrg]: {},
};

const keyValueReducer = createReducer<IKeyValueState>(
  {
    ...def,
  },
  (builder) => {
    const setKeyFn = (
      state: WritableDraft<IKeyValueState>,
      action: { payload: IKeyValueState }
    ) => {
      const key = action.payload.key;
      const value = action.payload.value;
      state[key] = value;
    };

    builder.addCase(KeyValueActions.setKey, setKeyFn);
    builder.addCase(KeyValueActions.setLoadingState, setKeyFn);
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

    builder.addCase(KeyValueActions.pushRooms, (state, action) => {
      const rooms = state[KeyValueKeys.RoomsSubscribedTo] || {};

      action.payload.forEach((name) => {
        rooms[name] = true;
      });

      state[KeyValueKeys.RoomsSubscribedTo] = rooms;
    });

    builder.addCase(KeyValueActions.removeRooms, (state, action) => {
      const rooms = state[KeyValueKeys.RoomsSubscribedTo] || {};
      action.payload.forEach((name) => {
        delete rooms[name];
      });

      state[KeyValueKeys.RoomsSubscribedTo] = rooms;
    });

    builder.addCase(SessionActions.logoutUser, () => {
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
