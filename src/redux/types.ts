import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import { IBlocksState } from "./blocks/types";
import { IChatsState } from "./chats/types";
import { IKeyValueState } from "./key-value/types";
import { INotificationsState } from "./notifications/types";
import { IOperationState } from "./operations/reducer";
import { IRoomsState } from "./rooms/types";
import { ISessionState } from "./session/types";
import { IUsersState } from "./users/types";

export interface IAppState {
    blocks: IBlocksState;
    users: IUsersState;
    notifications: INotificationsState;
    session: ISessionState;
    operations: IOperationState;
    keyValue: IKeyValueState;
    rooms: IRoomsState;
    chats: IChatsState;
}

export interface IAppAsyncThunkConfig {
    state: IAppState;
    dispatch: Dispatch;
    extra?: unknown;
    rejectValue?: unknown;
}

export type AppDispatch = ThunkDispatch<IAppState, void, AnyAction>;
