import { createReducer } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { defaultTo } from "lodash";
import { IMergeDataMetaExported, mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import KeyValueActions from "./actions";
import { IKeyValue, IKeyValueState, ILoadingStateLoadingList, KeyValueKeys } from "./types";

const defaultState = {
  [KeyValueKeys.ShowAppMenu]: true,
  [KeyValueKeys.ShowOrgMenu]: true,
};

const keyValueReducer = createReducer<IKeyValueState>(
  {
    ...defaultState,
  },
  (builder) => {
    const setKeyFn = (state: WritableDraft<IKeyValueState>, action: { payload: IKeyValue }) => {
      const key = action.payload.key;
      const value = action.payload.value;
      state[key] = value;
    };

    const mergeKeyFn = (
      state: WritableDraft<IKeyValueState>,
      action: { payload: IKeyValue & IMergeDataMetaExported }
    ) => {
      const key = action.payload.key;
      const value = mergeData(defaultTo(state[key], {}), action.payload.value, action.payload.meta);
      state[key] = value;
    };

    builder.addCase(KeyValueActions.setKey, setKeyFn);
    builder.addCase(KeyValueActions.setLoadingState, setKeyFn);
    builder.addCase(KeyValueActions.mergeKey, mergeKeyFn);
    builder.addCase(KeyValueActions.mergeLoadingState, mergeKeyFn);
    builder.addCase(KeyValueActions.setValues, (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        const value = action.payload[key];
        state[key] = value;
      });
    });

    builder.addCase(KeyValueActions.setLoadingList, (state, action) => {
      const { key, value } = action.payload;
      let loadingState: ILoadingStateLoadingList | undefined = state[key];
      let idList: Array<string> = [];
      if (loadingState && loadingState.value?.idList) {
        idList = loadingState.value?.idList;
      } else {
        idList = new Array(value.count);
      }

      value.idList.forEach((id, i) => {
        idList[value.index + i] = id;
      });
      loadingState = {
        isLoading: false,
        initialized: true,
        value: {
          idList,
          count: value.count,
        },
      };
      state[key] = loadingState;
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
      Object.keys(defaultState).forEach((key) => {
        state[key] = defaultState[key];
      });
    });
  }
);

export default keyValueReducer;
