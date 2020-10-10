import { createAction } from "@reduxjs/toolkit";

const setKeyValue = createAction<{
    key: string;
    value: any;
}>("keyValue/set");

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
}
