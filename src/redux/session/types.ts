export enum SessionType {
  Initializing = "initializing",
  Web = "web",
  App = "app",
  Uninitialized = "uninitialized",
}

export interface ISessionState {
  sessionType: SessionType;
  token?: string;
  userId?: string;
}
