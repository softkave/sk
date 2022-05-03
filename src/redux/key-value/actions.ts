import { createAction } from "@reduxjs/toolkit";
import { IKeyValue, ILoadingState } from "./types";

const setKeyValue = createAction<IKeyValue>("keyValue/set");
const setLoadingState = createAction<{
  key: string;
  value: ILoadingState;
}>("keyValue/setLoadingState");

const setValues = createAction<{
  [key: string]: any;
}>("keyValue/setValues");

const deleteKeyValue = createAction<string>("keyValue/deleteKey");

// room utilities
const pushRooms = createAction<string[]>("keyValue/pushRoom");
const removeRooms = createAction<string[]>("keyValue/removeRoom");

export default class KeyValueActions {
  public static setKey = setKeyValue;
  public static setValues = setValues;
  public static deleteKey = deleteKeyValue;
  public static pushRooms = pushRooms;
  public static removeRooms = removeRooms;
  public static setLoadingState = setLoadingState;
}
