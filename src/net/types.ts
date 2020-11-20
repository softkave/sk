export interface IAppError extends Error {
    field?: string;
    action?: string;
}

export interface IEndpointResultBase {
    errors?: IAppError[];
}

export type GetEndpointResult<T extends object = object> = T &
    IEndpointResultBase;

export type GetEndpointResultError<T extends object = object> = {
    [K in keyof T]?: T[K] extends any[]
        ? T[K][0] extends object
            ? GetEndpointResultError<T[K][0]>
            : string
        : T[K] extends object
        ? GetEndpointResultError<T[K]>
        : string;
};
