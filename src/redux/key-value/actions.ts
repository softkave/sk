import { createAction } from "@reduxjs/toolkit";

const setKeyValue = createAction<{
  key: string;
  value: boolean | number | string | object;
}>("keyValue/set");

const setValues = createAction<{
  [key: string]: boolean | number | string | object;
}>("keyValue/setValues");

const deleteKeyValue = createAction<string>("keyValue/deleteKey");

export default class KeyValueActions {
  public static setKey = setKeyValue;
  public static setValues = setValues;
  public static deleteKey = deleteKeyValue;
}
