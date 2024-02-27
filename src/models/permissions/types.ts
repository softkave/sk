import { IWorkspaceResource, SystemResourceType } from "../app/types";

export interface IPermissionGroupContainer {
  containerType: SystemResourceType;
  containerId: string;
}

export interface IPermissionGroup extends IWorkspaceResource {
  workspaceId: string;
  container: IPermissionGroupContainer;
  name: string;
  description?: string;
  isSystemManaged?: boolean;
}

export interface IPermissionItemEntity {
  entityType: SystemResourceType;
  entityId?: string;
}
export type PermissionItemAction = string;
export interface IPermissionItemTarget {
  containerId: string;
  containerType: SystemResourceType;
  targetType: SystemResourceType;
  targetId: string;
}

export type SoftkavePermissionActions_Org = "create-org" | "update-org" | "read-org" | "delete-org";
export type SoftkavePermissionActions_Board =
  | "create-board"
  | "update-board"
  | "read-board"
  | "delete-board";
export type SoftkavePermissionActions_Task =
  | "create-task"
  | "update-task"
  | "read-task"
  | "delete-task"
  | "toggle-task"
  | "transfer-task"
  | "create-subtask"
  | "update-subtask"
  | "delete-subtask"
  | "toggle-subtask";
export type SoftkavePermissionActions_Permissions =
  | "create-permission-group"
  | "update-permission-group"
  | "read-permission-group"
  | "delete-permission-group"
  | "assign-permission"
  | "update-permissions";
export type SoftkavePermissionActions_Chat = "chat" | "create-chat-room";
export type SoftkavePermissionActions_Collaborator =
  | "invite-collaborator"
  | "read-request"
  | "revoke-request"
  | "update-request"
  | "remove-collaborator"
  | "read-collaborator";
export type SoftkavePermissionActions_Sprint =
  | "create-sprint"
  | "read-sprint"
  | "update-sprint"
  | "delete-sprint"
  | "start-sprint"
  | "end-sprint";
export type SoftkavePermissionActions =
  | "*"
  | SoftkavePermissionActions_Org
  | SoftkavePermissionActions_Board
  | SoftkavePermissionActions_Task
  | SoftkavePermissionActions_Chat
  | SoftkavePermissionActions_Collaborator
  | SoftkavePermissionActions_Permissions
  | SoftkavePermissionActions_Sprint;

export const softkaveActionsList = [
  "create-org",
  "update-org",
  "read-org",
  "delete-org",

  "create-board",
  "update-board",
  "read-board",
  "delete-board",

  "create-task",
  "update-task",
  "read-task",
  "delete-task",
  "toggle-task",
  "transfer-task",
  "create-subtask",
  "update-subtask",
  "delete-subtask",
  "toggle-subtask",

  "create-permission-group",
  "update-permission-group",
  "read-permission-group",
  "delete-permission-group",
  "assign-permission",
  "update-permissions",

  "chat",
  "create-chat-room",

  "invite-collaborator",
  "read-request",
  "revoke-request",
  "update-request",
  "remove-collaborator",
  "read-collaborator",

  "create-sprint",
  "read-sprint",
  "update-sprint",
  "delete-sprint",
  "start-sprint",
  "end-sprint",

  "*",
];

export interface IPermissionItem extends IWorkspaceResource {
  entity: IPermissionItemEntity;
  action: SoftkavePermissionActions;
  target: IPermissionItemTarget;
  allow: boolean;
}

export interface IPermissionGroupInput {
  name: string;
  container: IPermissionGroupContainer;
  description?: string;
}

export type IPermissionGroupWithAssignedInfo = IPermissionGroup & {
  assignedAt: Date | string;
  assignedBy: string;
  order: number;
};

export interface IPermissionItemInput {
  entity: IPermissionItemEntity;
  action: SoftkavePermissionActions;
  target: IPermissionItemTarget;
  allow: boolean;
}
