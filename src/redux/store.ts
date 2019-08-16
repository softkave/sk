import { combineReducers, createStore } from "redux";

import { blocksReducer, IBlocksState } from "./blocks/reducer";
import {
  INotificationsState,
  notificationsReducer
} from "./notifications/reducer";
import { ISessionReduxState, sessionReducer } from "./session/reducer";
import { IUsersState, usersReducer } from "./users/reducer";

export interface IReduxState {
  blocks: IBlocksState;
  users: IUsersState;
  notifications: INotificationsState;
  session: ISessionReduxState;
}

const reducers = combineReducers({
  blocks: blocksReducer,
  users: usersReducer,
  notifications: notificationsReducer,
  session: sessionReducer
});

const storeData = {};

const store = createStore(
  reducers,
  storeData,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
