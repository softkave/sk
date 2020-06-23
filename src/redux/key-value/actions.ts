import { createAction } from "@reduxjs/toolkit";

const setKeyValue = createAction<{
  key: string;
  value: boolean | number | string | object;
}>("keyValue/set");

const deleteKeyValue = createAction<string>("keyValue/deleteKey");

export default class KeyValueActions {
  public static setKey = setKeyValue;
  public static deleteKey = deleteKeyValue;
}
