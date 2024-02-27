import { ObjectValues } from "../../utils/types";

export enum SystemResourceType {
  All = "*",
  User = "user",
  AnonymousUser = "anonymousUser",
  Client = "client",
  Workspace = "workspace",
  Board = "board",
  Task = "task",
  Status = "status",
  Label = "label",
  TaskResolution = "taskResolution",
  Note = "note",
  Comment = "comment",
  ChatRoom = "room",
  Sprint = "sprint",
  Chat = "chat",
  SubTask = "subtask",
  CollaborationRequest = "collaborationRequest",
  PermissionItem = "permissionItem",
  PermissionGroup = "permissionGroup",
  Notification = "notification",
  CustomProperty = "customProperty",
  CustomValue = "customValue",
  PushSubscription = "pushSub",

  Temporary = "temp",
  DemoUser = "demo",
}

export enum NotificationTypes {
  CollaboratorRemoved = "userRemoved",
  CollaboratorLeft = "userLeft",
}

export enum SystemActionType {
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}

export interface IResourceWithDescriptor<T> {
  customId: string;
  type: SystemResourceType;
  data: T;
}

export const ResourceVisibilityMap = {
  Public: "public",
  Organization: "organization",
  Board: "board",
  Private: "private",
} as const;

export type ResourceVisibility = ObjectValues<typeof ResourceVisibilityMap>;

export interface IResource {
  customId: string;
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: string;
  createdAt: string;
  lastUpdatedAt?: string;
}

export interface IWorkspaceResource extends IResource {
  workspaceId: string;
  visibility: ResourceVisibility;
  createdBy: string;
  lastUpdatedBy?: string;
}

export interface IResourceWithId {
  customId: string;
}
