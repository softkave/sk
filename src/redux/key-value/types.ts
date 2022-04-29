import { SystemResourceType } from "../../models/app/types";
import { IChat } from "../../models/chat/types";
import { IAppError } from "../../net/types";

export interface IKeyValueState {
  [key: string]: any;
}

export enum KeyValueKeys {
  ShowAppMenu = "showAppMenu",
  ShowOrgMenu = "showOrgMenu",
  ShowNewOrgForm = "showNewOrgForm",
  RootBlocksLoaded = "rootBlocksLoaded",
  RoomsSubscribedTo = "roomsSubscribedTo",
  SocketDisconnectedAt = "socketDisconnectedAt",
  SocketConnected = "socketConnected",
  FetchingMissingBroadcasts = "fetchingMissingBroadcasts",
  UnseenChatsCountByOrg = "unseenChatsCountByOrg",
  QueuedChats = "queuedChats",
  LoginAgain = "loginAgain",
  SubscribeToPushNotifications = "SubscribeToPushNotifications",
  IsAppHidden = "isAppHidden",
  LoadingKey = "loadingKey",
}

export const loadingStateKeys = {
  organization(orgId: string) {
    return `${KeyValueKeys.LoadingKey}:${orgId}`;
  },
  organizationCollaborators(orgId: string) {
    return `${this.organization(orgId)}:collaborators`;
  },
  organizationRooms(orgId: string) {
    return `${this.organization(orgId)}:rooms`;
  },
};

export interface IUnseenChatsCountByOrg {
  [key: string]: number;
}

export type RoomResourceType =
  | SystemResourceType.Org
  | SystemResourceType.Board
  | SystemResourceType.User
  | SystemResourceType.Room;

export type SubRoomResourceType =
  | SystemResourceType.Task
  | SystemResourceType.Sprint;

export interface IRoomLikeResource {
  customId: string;
  type: RoomResourceType;
  subRoom?: SubRoomResourceType;
}

export type ClientSubscribedResources = IRoomLikeResource[];

export interface IQueuedChatsByRoomId {
  [key: string]: Array<IChat & { chatIndex: number }>;
}

export interface ILoadingState {
  isLoading?: boolean;
  error?: IAppError[];
  initialized?: boolean;
}

export interface IKeyValue {
  key: string;
  value: any;
}
