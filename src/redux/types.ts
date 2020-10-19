import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import { IMergeDataMeta } from "../utils/utils";
import { IBlocksState } from "./blocks/types";

import { IKeyValueState } from "./key-value/types";
import { INotificationsState } from "./notifications/types";
import { IOperationState } from "./operations/reducer";
import { IRoomsMap } from "./rooms/types";
import { ISessionState } from "./session/types";
import { ISprintsState } from "./sprints/types";
import { IUsersState } from "./users/types";

export interface IAppState {
    blocks: IBlocksState;
    users: IUsersState;
    notifications: INotificationsState;
    session: ISessionState;
    operations: IOperationState;
    keyValue: IKeyValueState;
    rooms: IRoomsMap;
    sprints: ISprintsState;
}

export interface IAppAsyncThunkConfig {
    state: IAppState;
    dispatch: Dispatch;
    extra?: unknown;
    rejectValue?: unknown;
}

export type AppDispatch = ThunkDispatch<IAppState, void, AnyAction>;

export interface IResourcePayload {
    customId: string;
}

export interface IUpdateResourcePayload<R> {
    id: string;
    data: Partial<R>;
    meta?: IMergeDataMeta;
}
