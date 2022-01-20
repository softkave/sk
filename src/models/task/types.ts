import { IUpdateComplexTypeArrayInput } from "../../utils/types";
import {
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
    completedBy?: string;
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
    priority: string;
    subTasks: ISubTask[]; // should sub-tasks be their own blocks?
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: string;
    taskResolution?: string;
    labels: IBlockAssignedLabel[];
    taskSprint?: ITaskSprint;
}

export interface INewTaskInput {
    name: string;
    description?: string;
    dueAt?: string;
    parent: string;
    rootBlockId: string;
    assignees: IAssigneeInput[];
    priority: string;
    subTasks: ISubTaskInput[];
    status?: string;
    taskResolution?: string;
    labels: IBlockAssignedLabelInput[];
    taskSprint?: ITaskSprintInput;
}

export interface IUpdateTaskInput {
    name?: string;
    description?: string;
    priority?: string;
    parent?: string;
    subTasks?: IUpdateComplexTypeArrayInput<ISubTaskInput>;
    dueAt?: string;
    assignees?: IUpdateComplexTypeArrayInput<IAssigneeInput>;
    status?: string;
    taskResolution?: string;
    labels?: IUpdateComplexTypeArrayInput<IBlockAssignedLabelInput>;
    taskSprint?: ITaskSprintInput;
}
