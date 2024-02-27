import { IWorkspaceResource } from "../app/types";

export interface IWorkspace extends IWorkspaceResource {
  name: string;
  description?: string;
  color: string;
  publicPermissionGroupId?: string;
}

export interface IAppWorkspace extends IWorkspace {
  collaboratorIds: string[];
  boardIds: string[];
  unseenChatsCount?: number;
}

export interface INewOrganizationInput {
  name: string;
  description?: string;
  color: string;
}

export interface IUpdateOrganizationInput {
  name?: string;
  description?: string;
  color?: string;
}
