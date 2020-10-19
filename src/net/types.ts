export interface IAppError extends Error {
    field?: string;
    action?: string;
}

export interface IEndpointResultBase {
    errors?: IAppError[];
}

export type GetEndpointResult<T extends any = any> = {
    data?: T;
} & IEndpointResultBase;
