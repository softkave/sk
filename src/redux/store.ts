import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { blocksReducer, IBlocksState } from "./blocks/reducer";
import {
  INotificationsState,
  notificationsReducer,
} from "./notifications/reducer";
import operationsReducer, { IOperationState } from "./operations/reducer";
import { ISessionState, sessionReducer } from "./session/reducer";
import { IUsersState, usersReducer } from "./users/reducer";

export interface IAppState {
  blocks: IBlocksState;
  users: IUsersState;
  notifications: INotificationsState;
  session: ISessionState;
  operations: IOperationState;
}

const reducer = combineReducers({
  blocks: blocksReducer,
  users: usersReducer,
  notifications: notificationsReducer,
  session: sessionReducer,
  operations: operationsReducer,
});

const store = configureStore({
  reducer,
});

export default store;
