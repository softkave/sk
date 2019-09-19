import { combineReducers, createStore } from "redux";

import { blocksReducer, IBlocksState } from "./blocks/reducer";
import {
  INotificationsState,
  notificationsReducer
} from "./notifications/reducer";
import { ISessionReduxState, sessionReducer } from "./session/reducer";
import { IUsersState, usersReducer } from "./users/reducer";
import viewReducer, { IViewState } from "./view/reducers";

export interface IReduxState {
  blocks: IBlocksState;
  users: IUsersState;
  notifications: INotificationsState;
  session: ISessionReduxState;
  view: IViewState;
}

const reducers = combineReducers({
  blocks: blocksReducer,
  users: usersReducer,
  notifications: notificationsReducer,
  session: sessionReducer,
  view: viewReducer
});

const storeData = {};

const store = createStore(
  reducers,
  storeData,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
