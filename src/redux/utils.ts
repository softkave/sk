import { PayloadAction } from "@reduxjs/toolkit";
import isString from "lodash/isString";
import { INetError } from "../net/types";
import { mergeData } from "../utils/utils";
import { IResourcePayload, IUpdateResourcePayload } from "./types";

export const errorToAppError = (err: Error | INetError | string): INetError => {
    const error = isString(err) ? new Error(err) : err;

    return {
        name: error.name,
        message: error.message,
        action: (error as any).action,
        field: (error as any).field,
    };
};

export const getAppErrorOrAppErrorList = (err: any) => {
    if (Array.isArray(err)) {
        return err.map((error) => errorToAppError(error));
    } else {
        return errorToAppError(err);
    }
};

export function addResources<
    S extends object,
    A extends PayloadAction<IResourcePayload[]>
>(state: S, action: A) {
    action.payload.forEach((room) => (state[room.customId] = room));
}

export function updateResources<
    S extends object,
    A extends PayloadAction<Array<IUpdateResourcePayload<any>>>
>(state: S, action: A) {
    action.payload.forEach((param) => {
        const room = mergeData(state[param.id], param.data, param.meta);
        state[room.customId] = room;
    });
}

export function deleteResources<
    S extends object,
    A extends PayloadAction<string[]>
>(state: S, action: A) {
    action.payload.forEach((id) => delete state[id]);
}
