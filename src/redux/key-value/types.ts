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
  QueuedChats = "queuedChats",
  LoginAgain = "loginAgain",
  SubscribeToPushNotifications = "SubscribeToPushNotifications",
  IsAppHidden = "isAppHidden",
  LoadingKey = "loadingKey",
}

export const loadingStateKeys = {
  // Organization
  organization(orgId: string) {
    return `${KeyValueKeys.LoadingKey}:organization:${orgId}`;
  },

  // Collaborator
  organizationCollaborators(orgId: string) {
    return `${this.organization(orgId)}:collaborators`;
  },

  // Room
  organizationRooms(orgId: string) {
    return `${this.organization(orgId)}:rooms`;
  },
  addRoom(orgId: string, recipientId: string) {
    return `${this.organization(orgId)}:addRoom:${recipientId}`;
  },
  getRooms(orgId: string) {
    return `${this.organization(orgId)}:rooms`;
  },
  getRoomChats(orgId: string, roomId: string) {
    return `${this.organization(orgId)}:roomChats:${roomId}`;
  },
  getRoomsUnseenChatsCount(orgId: string) {
    return `${this.organization(orgId)}:roomsUnseenChatsCount`;
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

export interface ILoadingState<T = any> {
  isLoading?: boolean;
  error?: IAppError[];
  initialized?: boolean;
  value?: T;
}

export interface IKeyValue {
  key: string;
  value: any;
}
