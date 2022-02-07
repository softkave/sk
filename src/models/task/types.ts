import { IOperation } from "../../redux/operations/operation";
import { IUpdateComplexTypeArrayInput } from "../../utils/types";
import {
  BlockPriority,
  BlockType,
  IBlockAssignedLabel,
  ISubTask,
  ITaskAssignee,
  ITaskSprint,
} from "../block/block";
import { IResourceWithId } from "../types";

export interface IAssigneeInput {
  userId: string;
}

export interface ISubTaskInput extends IResourceWithId {
  description: string;
  completedBy?: string | null;
}

export interface IBlockAssignedLabelInput {
  customId: string;
}

export interface ITaskSprintInput {
  sprintId: string;
}

export interface ITask {
  customId: string;
  createdBy: string;
  createdAt: string;
  name: string;
  description?: string;
  type: BlockType.Task;
  dueAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  parent: string;
  rootBlockId: string;
  assignees: ITaskAssignee[];
  priority: BlockPriority;
  subTasks: ISubTask[]; // should sub-tasks be their own blocks?
  status?: string | null;
  statusAssignedBy?: string;
  statusAssignedAt?: string;
  taskResolution?: string | null;
  labels: IBlockAssignedLabel[];
  taskSprint?: ITaskSprint | null;

  // From app
  taskCommentOp?: IOperation;
}

export interface INewTaskInput {
  name: string;
  description?: string;
  dueAt?: string;
  parent: string;
  rootBlockId: string;
  assignees: IAssigneeInput[];
  priority: BlockPriority;
  subTasks: ISubTaskInput[];
  labels: IBlockAssignedLabelInput[];
  status?: string | null;
  taskResolution?: string | null;
  taskSprint?: ITaskSprintInput | null;
}

export interface IUpdateTaskInput {
  name?: string;
  description?: string;
  priority?: BlockPriority;
  parent?: string;
  subTasks?: IUpdateComplexTypeArrayInput<ISubTaskInput>;
  dueAt?: string;
  assignees?: IUpdateComplexTypeArrayInput<IAssigneeInput>;
  status?: string;
  taskResolution?: string;
  labels?: IUpdateComplexTypeArrayInput<IBlockAssignedLabelInput>;
  taskSprint?: ITaskSprintInput;
}
