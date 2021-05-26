import { IClient } from "../../models/user/user";

export enum SessionType {
    Initializing = "initializing",
    Web = "web",
    App = "app",
    Uninitialized = "uninitialized",
}

export interface ISessionState {
    sessionType: SessionType;
    isDemo?: boolean;
    token?: string;
    userId?: string;
    client?: IClient;
}
