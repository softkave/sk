export interface IAppError extends Error {
    field?: string;
    action?: string;
}

export interface IEndpointResultBase {
    errors?: IAppError[];
}

export type GetEndpointResult<T extends object = object> = T &
    IEndpointResultBase;

export interface IUpdateItemById<T> {
    id: string;
    data: Partial<T>;
}

export interface IUpdateComplexTypeArrayInput<T> {
    add?: T[];
    remove?: string[];
    update?: Array<IUpdateItemById<T>>;
}
