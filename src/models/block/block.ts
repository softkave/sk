import { IOperation } from "../../redux/operations/operation";
import { IBoardSprintOptions } from "../sprint/types";

export enum BlockPriority {
  High = "high",
  Medium = "medium",
  Low = "low",
}

export enum BlockType {
  Root = "root",
  Organization = "org",
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
  completedBy?: string | null;
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
  position: number;
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

export interface IBoardTaskResolution {
  customId: string;
  name: string;
  createdBy: string;
  createdAt: string;
  description?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ITaskSprint {
  sprintId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface IPersistedBlock {
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
  priority?: BlockPriority;
  subTasks?: ISubTask[]; // should sub-tasks be their own blocks?
  boardStatuses?: IBlockStatus[];
  boardLabels?: IBlockLabel[];
  boardResolutions?: IBoardTaskResolution[];
  status?: string | null;
  statusAssignedBy?: string;
  statusAssignedAt?: string;
  taskResolution?: string | null;
  labels?: IBlockAssignedLabel[];
  currentSprintId?: string | null;
  sprintOptions?: IBoardSprintOptions;
  taskSprint?: ITaskSprint | null;
  lastSprintId?: string;
}

export interface IBlock extends IPersistedBlock {
  // organization
  boards?: string[];
  collaborators?: string[];
  notifications?: string[];

  // organization and board
  userLeftBlockAt?: number;
  missingBroadcastsLastFetchedAt?: number;

  // board
  avgTimeToCompleteTasks?: number;

  // task
  taskCommentOp?: IOperation;
}

export interface ISubTaskInput {
  customId: string;
  description: string;
  completedBy?: string | null;
}

export interface IBlockStatusInput {
  customId: string;
  name: string;
  color: string;
  position: number;
  description?: string;
}

export interface IBlockLabelInput {
  customId: string;
  name: string;
  color: string;
  description?: string;
}

export interface IBoardStatusResolutionInput {
  customId: string;
  name: string;
  description?: string;
}

export function findBlock(blocks: IBlock[], id: string): IBlock | undefined {
  return blocks.find((block) => {
    return block.customId === id;
  });
}

export function getBlockTypeLabel(type: BlockType): string {
  switch (type) {
    case BlockType.Root:
      return "Root";
    case BlockType.Organization:
      return "Organization";
    case BlockType.Board:
      return "Board";
    case BlockType.Task:
      return "Task";
    default:
      return "Unknown";
  }
}
