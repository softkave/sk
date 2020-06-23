import {
  Action,
  AnyAction,
  AsyncThunkAction,
  Dispatch,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { IBlocksState } from "./blocks/types";
import { IKeyValueState } from "./key-value/types";
import { INotificationsState } from "./notifications/types";
import { IOperationState } from "./operations/reducer";
import { ISessionState } from "./session/types";
import { IUsersState } from "./users/types";

export interface IAppState {
  blocks: IBlocksState;
  users: IUsersState;
  notifications: INotificationsState;
  session: ISessionState;
  operations: IOperationState;
  keyValue: IKeyValueState;
}

export interface IAppAsyncThunkConfig {
  state: IAppState;
  dispatch: Dispatch;
  extra?: unknown;
  rejectValue?: unknown;
}
