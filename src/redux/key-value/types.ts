import { SystemActionType, SystemResourceType } from "../../models/app/types";
import { IChat } from "../../models/chat/types";
import { IAppError } from "../../utils/errors";

export interface IKeyValueState {
  [key: string]: any;
}

export enum KeyValueKeys {
  ShowAppMenu = "showAppMenu",
  ShowOrgMenu = "showOrgMenu",
  RoomsSubscribedTo = "roomsSubscribedTo",
  SocketDisconnectedAt = "socketDisconnectedAt",
  SocketConnected = "socketConnected",
  FetchingMissingBroadcasts = "fetchingMissingBroadcasts",
  QueuedChats = "queuedChats",
  LoginAgain = "loginAgain",
  SubscribeToPushNotifications = "SubscribeToPushNotifications",
  IsAppHidden = "isAppHidden",
  LoadingKey = "L",
  Permissions = "permissions",
}

export const appLoadingKeys = {
  // session
  initializeAppSession: `${KeyValueKeys.LoadingKey}:initializeAppSession`,

  // Organization
  userOrganizations: `${KeyValueKeys.LoadingKey}:userOrganizations`,
  userCollaborationRequests: `${KeyValueKeys.LoadingKey}:userRequests`,
  organization(orgId: string) {
    return `${KeyValueKeys.LoadingKey}:organization:${orgId}`;
  },
  organizationRequests(orgId: string) {
    return `${this.organization(orgId)}:requests`;
  },

  // Board
  orgBoards(orgId: string) {
    return `${this.organization(orgId)}:boards`;
  },
  board(orgId: string, boardId: string) {
    return `${this.orgBoards(orgId)}:${boardId}`;
  },
  boardTasks(orgId: string, boardId: string) {
    return `${this.board(orgId, boardId)}:tasks`;
  },
  boardSprints(orgId: string, boardId: string) {
    return `${this.board(orgId, boardId)}:sprints`;
  },
  boardAverageTimeToCompleteTask(orgId: string, boardId: string) {
    return `${this.board(orgId, boardId)}:boardAverageTimeToCompleteTask`;
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

  // permissions
  permissionGroups(resourceId: string, type: SystemResourceType) {
    return `${KeyValueKeys.LoadingKey}:permissionGroups:${type}:${resourceId}`;
  },
  permissionGroup(pgId: string) {
    return `${KeyValueKeys.LoadingKey}:permissionGroup:${pgId}`;
  },
  permissionGroupAssignees(pgId: string) {
    return `${this.permissionGroup(pgId)}:assignees`;
  },
  permissions(orgId: string, q: any) {
    return `${KeyValueKeys.LoadingKey}:permissions:${orgId}:${JSON.stringify(q)}`;
  },
  permissionGroupsAssigned(
    containerType: SystemResourceType,
    containerId: string,
    assignedToType: SystemResourceType,
    assignedToId: string[]
  ) {
    // TODO: are these keys getting too long, and what can we do about them?
    // Also, what happens when we have a log ids, joining them can affect
    // performance. Using a Map should maybe solve this, but I don't think Redux
    // uses Maps.
    return `${
      KeyValueKeys.LoadingKey
    }:permissionGroupsAssigned:${containerType}:${containerId}${assignedToType}:${assignedToId.join(
      "_"
    )}`;
  },
  userOrganizationPermissionItemList(orgId: string) {
    return `${this.organization(orgId)}:userPermissionItemList`;
  },
};

export interface IUnseenChatsCountByOrg {
  [key: string]: number;
}

export type RoomResourceType =
  | SystemResourceType.Workspace
  | SystemResourceType.Board
  | SystemResourceType.User
  | SystemResourceType.ChatRoom;

export type SubRoomResourceType = SystemResourceType.Task | SystemResourceType.Sprint;

export interface IRoomLikeResource {
  customId: string;
  type: RoomResourceType;
  subRoom?: SubRoomResourceType;

  /** For subscribing to action-related room, for example, organizations can
   * have the {@link SystemActionType.Read} room for normal updates and
   * {@link SystemActionType.AssignPermission} room for updates to permission,
   * for those who can read other's permissions. Defaults to
   * {@link SystemActionType.Read}. */
  action?: SystemActionType;
}

export type ClientSubscribedResources = IRoomLikeResource[];

export interface IQueuedChatsByRoomId {
  [key: string]: Array<IChat & { chatIndex: number }>;
}

export interface ILoadingState<T = any> {
  isLoading?: boolean;
  error?: IAppError[] | null;
  initialized?: boolean;
  value?: T | null;
}

export type ExtractLoadingStateValue<T extends ILoadingState> = T extends ILoadingState<infer V>
  ? V
  : unknown;
export type MergeLoadingStates<T1 extends ILoadingState, T2 extends ILoadingState> = ILoadingState<
  ExtractLoadingStateValue<T1> & ExtractLoadingStateValue<T2>
>;
export type OmitLoadingStates<T1 extends ILoadingState, T2 extends ILoadingState> = ILoadingState<
  Omit<ExtractLoadingStateValue<T1>, keyof ExtractLoadingStateValue<T2>>
>;
export type OmitLoadingStatesValue<
  T1 extends ILoadingState,
  T2 extends ILoadingState
> = ExtractLoadingStateValue<OmitLoadingStates<T1, T2>>;

export type ILoadingStateLoadingList = ILoadingState<{
  idList: string[];
  count: number;
}>;

export interface IKeyValue<T = any> {
  key: string;
  value: T;
}
export type LoadingListPayload = IKeyValue<{
  idList: string[];
  count: number;
  index: number;
}>;

export type ExtractKeyValue<K extends IKeyValue> = K extends IKeyValue<infer V> ? V : unknown;

// Loading state value types
export type ILoadingStateLoadingListValue = ExtractLoadingStateValue<ILoadingStateLoadingList>;

// Key-value value types
export type LoadingListPayloadValue = ExtractKeyValue<LoadingListPayload>;
