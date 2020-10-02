export interface INetError extends Error {
    field?: string;
    action?: string;
}

export interface IEndpointResultBase {
    errors: INetError[];
}
