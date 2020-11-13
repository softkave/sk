import { IAppError } from "../types";

export interface IOutgoingSocketEventPacket<T> {
    token: string;
    data: T;
}

export interface IIncomingSocketEventPacket<T> {
    errors?: IAppError;
    data?: T;
}
