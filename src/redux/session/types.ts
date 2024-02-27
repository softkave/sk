import { IClient } from "../../models/user/types";

export enum SessionType {
  Initializing = "initializing",
  Initialized = "initialized",
  Uninitialized = "uninitialized",
}

export interface ISessionState {
  sessionType: SessionType;
  isDemo?: boolean;
  token?: string;
  userId?: string;
  client?: IClient;
}
