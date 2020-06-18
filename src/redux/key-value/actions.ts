import { createAction } from "@reduxjs/toolkit";

const keyValue = "keyValue";
const setKeyValueType = `${keyValue}/setKeyValue`;
const deleteKeyValueType = `${keyValue}/deleteKeyValue`;

export const setKeyValue = createAction<
  [string, boolean | number | string | object]
>(setKeyValueType);

export const deleteKeyValue = createAction<string>(deleteKeyValueType);
