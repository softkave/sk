import { IAppError } from "../utils/errors";

export interface IEndpointResultBase {
  errors?: IAppError[];
}

// TODO: T should be partial in situations when the calls fail
export type GetEndpointResult<T extends object = object> = T & IEndpointResultBase;

export type GetEndpointResultError<T extends object = object, E extends any = string> = {
  [K in keyof T]?: T[K] extends any[]
    ? T[K][number] extends object
      ? Array<GetEndpointResultError<T[K][number]>>
      : E
    : T[K] extends object
    ? GetEndpointResultError<T[K]>
    : E;
};
