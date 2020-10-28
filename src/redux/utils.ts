import isString from "lodash/isString";
import { IAppError } from "../net/types";
import { mergeData } from "../utils/utils";
import { IResourcePayload, IUpdateResourcePayload } from "./types";

export const errorToAppError = (err: Error | IAppError | string): IAppError => {
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

export function reducerAddResources<
    S extends object,
    A extends IResourcePayload[]
>(state: S, payload: A) {
    payload.forEach((room) => (state[room.customId] = room));
}

export function reducerUpdateResources<
    S extends object,
    A extends Array<IUpdateResourcePayload<any>>
>(state: S, payload: A) {
    payload.forEach((param) => {
        const item = mergeData(state[param.id], param.data, param.meta);
        state[item.customId || param.id] = item;
    });
}

export function reducerDeleteResources<S extends object, A extends string[]>(
    state: S,
    payload: A
) {
    payload.forEach((id) => delete state[id]);
}
