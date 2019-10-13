export interface ITaskCollaborator {
  userId: string;
  completedAt?: number;
  assignedAt: number;
  assignedBy: string;
}

export interface IBlockRole {
  roleName: string;
  createdBy: string;
  createdAt: number;
}

export type BlockPriority = "very important" | "important" | "not important";
export type BlockType = "org" | "project" | "group" | "task" | "root";

export interface IBlock {
  customId: string;
  name: string;
  description: string;
  expectedEndAt: number;
  createdAt: number;
  color: string;
  updatedAt: number;
  type: BlockType;
  parents: string[];
  createdBy: string;
  taskCollaborators: ITaskCollaborator[];
  priority: BlockPriority;
  isBacklog: boolean;
  tasks: string[];
  groups: string[];
  projects: string[];
  groupTaskContext: string[];
  groupProjectContext: string[];
  roles: IBlockRole[];
  collaborators: string[];
  collaborationRequests: string[];
}

export function findBlock(blocks: IBlock[], id: string): IBlock | undefined {
  return blocks.find(block => {
    return block.customId === id;
  });
}
