import { IUpdateComplexTypeArrayInput } from "../../utils/types";
import { IWorkspaceResource } from "../app/types";
import { IResourceWithId } from "../types";

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
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
  completedBy?: string | null;
  completedAt?: string;
}

export enum TaskPriority {
  Medium = "medium",
  Low = "low",
  High = "high",
}

export interface ITaskAssignedLabel {
  labelId: string;
  assignedBy: string;
  assignedAt: string;
}

export interface ITaskSprint {
  sprintId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface ITask extends IWorkspaceResource {
  name: string;
  description?: string;
  boardId: string;
  assignees: ITaskAssignee[];
  priority: TaskPriority;
  subTasks: ISubTask[];
  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: string;
  taskResolution?: string;
  labels: ITaskAssignedLabel[];
  dueAt?: string;
  taskSprint?: ITaskSprint | null;
}

export interface IAssigneeInput {
  userId: string;
}

export interface ISubTaskInput extends IResourceWithId {
  description: string;
  completedBy?: string | null;
}

export interface ITaskAssignedLabelInput {
  labelId: string;
}

export interface ITaskSprintInput {
  sprintId: string;
}

export interface ITaskAssigneeInput {
  userId: string;
}

export interface ITaskFormValues {
  name: string;
  description?: string;
  dueAt?: string;
  boardId: string;
  workspaceId: string;
  assignees: ITaskAssignee[];
  priority: TaskPriority;
  subTasks: ISubTask[];
  labels: ITaskAssignedLabel[];
  status?: string | null;
  taskResolution?: string | null;
  taskSprint?: ITaskSprint | null;
}

export interface INewTaskInput {
  name: string;
  description?: string;
  dueAt?: string;
  boardId: string;
  workspaceId: string;
  assignees: IAssigneeInput[];
  priority: TaskPriority;
  subTasks: ISubTaskInput[];
  labels: ITaskAssignedLabelInput[];
  status?: string | null;
  taskResolution?: string | null;
  taskSprint?: ITaskSprintInput | null;
}

export interface IUpdateTaskInput {
  name?: string;
  description?: string;
  priority?: TaskPriority;
  boardId?: string;
  subTasks?: IUpdateComplexTypeArrayInput<ISubTaskInput>;
  dueAt?: string;
  assignees?: IUpdateComplexTypeArrayInput<IAssigneeInput>;
  status?: string;
  taskResolution?: string;
  labels?: IUpdateComplexTypeArrayInput<ITaskAssignedLabelInput>;
  taskSprint?: ITaskSprintInput;
}
