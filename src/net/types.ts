export interface INetError {
    field?: string;
    message?: string;
    action?: string;
    name: string;
}

export interface IEndpointResultBase {
    errors: INetError[];
}
