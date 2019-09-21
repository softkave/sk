import { combineReducers, createStore } from "redux";

import { blocksReducer, IBlocksState } from "./blocks/reducer";
import {
  INotificationsState,
  notificationsReducer
} from "./notifications/reducer";
import operationsReducer, { IOperationState } from "./operations/reducer";
import { ISessionState, sessionReducer } from "./session/reducer";
import { IUsersState, usersReducer } from "./users/reducer";
import viewReducer, { IViewState } from "./view/reducers";

export interface IReduxState {
  blocks: IBlocksState;
  users: IUsersState;
  notifications: INotificationsState;
  session: ISessionState;
  view: IViewState;
  operations: IOperationState;
}

const reducers = combineReducers({
  blocks: blocksReducer,
  users: usersReducer,
  notifications: notificationsReducer,
  session: sessionReducer,
  view: viewReducer,
  operations: operationsReducer
});

const storeData = {};

const store = createStore(
  reducers,
  storeData,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
