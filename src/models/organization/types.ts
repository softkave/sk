import { BlockType } from "../block/block";

export interface IOrganization {
  customId: string;
  createdBy: string;
  createdAt: string;
  type: BlockType.Organization;
  name: string;
  description?: string;
  updatedAt?: string;
  updatedBy?: string;
  color: string;
}

export interface IAppOrganization extends IOrganization {
  collaboratorIds: string[];
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
