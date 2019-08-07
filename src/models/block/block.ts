import { IUser } from "../user/user";

export interface ITaskCollaborator {
  userId: string;
  completedAt: number;
  assignedAt: number;
  assignedBy: string;
}

export interface IBlockRole {
  roleName: string;
  createdBy: string;
  createdAt: number;
}

export type BlockPriority = "very important" | "important" | "not important";

export interface IBlock {
  customId: string;
  name: string;
  description: string;
  expectedEndAt: number;
  createdAt: number;
  color: string;
  updatedAt: number;
  type: string;
  parents: string[];
  createdBy: string;
  taskCollaborators: ITaskCollaborator[];
  priority: BlockPriority;
  isBacklog: boolean;
  position: number;
  positionTimestamp: number;
  tasks: string[];
  groups: string[];
  projects: string[];
  groupTaskContext: string[];
  groupProjectContext: string[];
  roles: IBlockRole[];
  path: string;
  collaborators: IUser[];

  // TODO: Define a new type of IBlock for client, Redux, etc
  group: { [key: string]: IBlock };
  task: { [key: string]: IBlock };
  project: { [key: string]: IBlock };

  // TODO: define type
  collaborationRequests: any[];
}
