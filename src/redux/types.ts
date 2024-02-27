import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import { IMergeDataMeta } from "../utils/utils";
import { IBoardsState } from "./boards/types";
import { ICollaborationRequestsState } from "./collaborationRequests/types";
import { ICommentsState } from "./comments/types";
import { IKeyValueState } from "./key-value/types";
import { IMapsState } from "./maps/types";
import { IWorkspacesState } from "./organizations/types";
import { IRoomsMap } from "./rooms/types";
import { ISessionState } from "./session/types";
import { ISprintsState } from "./sprints/types";
import { ITasksState } from "./tasks/types";
import { IUsersState } from "./users/types";

export interface IAppState {
  users: IUsersState;
  session: ISessionState;
  keyValue: IKeyValueState;
  rooms: IRoomsMap;
  sprints: ISprintsState;
  comments: ICommentsState;
  organizations: IWorkspacesState;
  boards: IBoardsState;
  tasks: ITasksState;
  collaborationRequests: ICollaborationRequestsState;
  maps: IMapsState;
}

/**
 * From @reduxks/toolkit
 */
export type AsyncThunkConfig = {
  state?: unknown;
  dispatch?: Dispatch;
  extra?: unknown;
  rejectValue?: unknown;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown;
  rejectedMeta?: unknown;
};

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

export interface IStoreLikeObject {
  getState: () => IAppState;
  dispatch: (action: any) => void;
}
