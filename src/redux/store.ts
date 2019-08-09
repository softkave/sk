import { combineReducers, createStore } from "redux";
import { blocksReducer, IBlocksReduxState } from "./blocks/reducer";
import {
  INotificationsReduxState,
  notificationsReducer
} from "./notifications/reducer";
import { IRolesReduxState, rolesReducer } from "./roles/reducer";
import { ISessionReduxState, sessionReducer } from "./session/reducer";
import { IUsersReduxState, usersReducer } from "./users/reducer";

export interface IReduxState {
  blocks: IBlocksReduxState;
  roles: IRolesReduxState;
  users: IUsersReduxState;
  notifications: INotificationsReduxState;
  session: ISessionReduxState;
}

const reducers = combineReducers({
  blocks: blocksReducer,
  roles: rolesReducer,
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
