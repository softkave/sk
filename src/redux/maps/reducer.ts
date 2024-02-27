import { createReducer } from "@reduxjs/toolkit";
import { forEach } from "lodash";
import { SystemResourceType } from "../../models/app/types";
import { IResourceWithId } from "../../models/types";
import { mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import { MapsActions } from "./actions";
import { IMapsState } from "./types";

const getDefaultState = () =>
  Object.values(SystemResourceType).reduce((state, key) => {
    state[key] = {};
    return state;
  }, {} as IMapsState);

const mapsReducer = createReducer<IMapsState>(getDefaultState(), (builder) => {
  function setList(
    state: IMapsState,
    payload: {
      key: SystemResourceType;
      list: IResourceWithId[];
    }
  ) {
    const map = state[payload.key] || {};
    payload.list.forEach((item) => {
      map[item.customId] = item;
    });
    state[payload.key] = map;
  }

  builder.addCase(MapsActions.setList, (state, action) => {
    setList(state, action.payload);
  });

  builder.addCase(MapsActions.setManyLists, (state, action) => {
    forEach(action.payload, (list, key) => {
      if (list) {
        setList(state, { list, key: key as SystemResourceType });
      }
    });
  });

  builder.addCase(MapsActions.deleteList, (state, action) => {
    const map = state[action.payload.key] || {};
    action.payload.list.forEach((item) => {
      delete map[item.customId];
    });
    state[action.payload.key] = map;
  });

  builder.addCase(MapsActions.updateListWithMeta, (state, action) => {
    const map = state[action.payload.key] || {};
    action.payload.list.forEach((item) => {
      map[item.customId] = mergeData(map[item.customId] || {}, item, action.payload.meta);
    });
    state[action.payload.key] = map;
  });

  builder.addCase(SessionActions.logoutUser, () => {
    return getDefaultState();
  });
});

export default mapsReducer;
