export const blockSchemaVersion = 3; // increment when you make changes that are not backward compatible

export enum BlockPriority {
  Important = "important",
  NotImportant = "not important",
  VeryImportant = "very important",
}

export enum BlockType {
  Root = "root",
  Org = "org",
  Board = "board",
  Task = "task",
}

export interface ITaskAssignee {
  userId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface ISubTask {
  customId: string;
  description: string;
  createdAt: string;
  createdBy: string;
  completedBy?: string;
  completedAt?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface IBlockLabel {
  customId: string;
  name: string;
  color: string;
  createdBy: string;
  createdAt: string;
  description?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface IBlockStatus {
  customId: string;
  name: string;
  color: string;
  createdBy: string;
  createdAt: string;
  description?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface IBlockAssignedLabel {
  customId: string;
  assignedBy: string;
  assignedAt: string;
}

export interface IBlock {
  customId: string;
  createdBy: string;
  createdAt: string;
  type: BlockType;
  name: string;
  description?: string;
  dueAt?: string;
  color?: string;
  updatedAt?: string;
  updatedBy?: string;
  parent?: string;
  rootBlockId?: string;
  assignees?: ITaskAssignee[];
  priority?: string;
  subTasks?: ISubTask[]; // should sub-tasks be their own blocks?
  boardStatuses?: IBlockStatus[];
  boardLabels?: IBlockLabel[];
  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: string;
  labels?: IBlockAssignedLabel[];

  boards?: string[];
  collaborators?: string[];
  notifications?: string[];
}

export function findBlock(blocks: IBlock[], id: string): IBlock | undefined {
  return blocks.find((block) => {
    return block.customId === id;
  });
}
