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

export const taskPriority = {
  important: "important",
  "not important": "not important",
  "very important": "very important"
};

export const blockType = {
  org: "org",
  project: "project",
  group: "group",
  task: "task",
  root: "root"
};

export type BlockPriority = keyof typeof taskPriority;
export type BlockType = keyof typeof blockType;

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
