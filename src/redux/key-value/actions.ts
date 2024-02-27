import { createAction } from "@reduxjs/toolkit";
import { IMergeDataMetaExported } from "../../utils/utils";
import { IKeyValue, ILoadingState, LoadingListPayload } from "./types";

// key-value actions
const setKeyValue = createAction<IKeyValue>("keyValue/set");
const mergeKeyValue = createAction<IKeyValue & IMergeDataMetaExported>("keyValue/merge");
const setValues = createAction<{
  [key: string]: any;
}>("keyValue/setValues");
const deleteKeyValue = createAction<string>("keyValue/deleteKey");

// loading state actions
const setLoadingState = createAction<IKeyValue<ILoadingState>>("keyValue/setLoadingState");
const mergeLoadingState = createAction<IKeyValue<ILoadingState> & IMergeDataMetaExported>(
  "keyValue/mergeLoadingState"
);
const setLoadingList = createAction<LoadingListPayload>("keyValue/setLoadingList");

// room actions
const pushRooms = createAction<string[]>("keyValue/pushRoom");
const removeRooms = createAction<string[]>("keyValue/removeRoom");

export default class KeyValueActions {
  static setKey = setKeyValue;
  static setValues = setValues;
  static mergeKey = mergeKeyValue;
  static deleteKey = deleteKeyValue;
  static pushRooms = pushRooms;
  static removeRooms = removeRooms;
  static setLoadingState = setLoadingState;
  static mergeLoadingState = mergeLoadingState;
  static setLoadingList = setLoadingList;
}
