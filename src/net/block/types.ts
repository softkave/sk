import { IAddCollaboratorFormItemValues } from "../../components/collaborator/AddCollaboratorFormItem";
import { BlockType, IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { GetEndpointResult, IUpdateComplexTypeArrayInput } from "../types";

export interface IAssigneeInput {
    userId: string;
}

export interface ISubTaskInput {
    description: string;
    completedBy?: string;
}

export interface IBlockStatusInput {
    name: string;
    color: string;
    description?: string;
}

export interface IBlockLabelInput {
    name: string;
    color: string;
    description?: string;
}

export interface IBoardStatusResolutionInput {
    name: string;
    description?: string;
}

export interface IBlockAssignedLabelInput {
    customId: string;
}

export interface ITaskSprintInput {
    sprintId: string;
}

export interface IAddBlockAPINewBlockInput {
    type: BlockType;
    name: string;
    description?: string;
    dueAt?: number;
    color?: string;
    parent?: string;
    rootBlockId?: string;
    assignees?: IAssigneeInput[];
    priority?: string;
    subTasks?: ISubTaskInput[];
    boardStatuses?: IBlockStatusInput[];
    boardLabels?: IBlockLabelInput[];
    boardResolutions?: IBoardStatusResolutionInput[];
    status?: string;
    taskResolution?: string;
    labels?: IBlockAssignedLabelInput[];
    taskSprint?: ITaskSprintInput;
}

export interface IUpdateBlockInput {
    name?: string;
    description?: string;
    color?: string;
    priority?: string;
    parent?: string;
    subTasks?: IUpdateComplexTypeArrayInput<ISubTaskInput>;
    dueAt?: number;
    assignees?: IUpdateComplexTypeArrayInput<IAssigneeInput>;
    boardStatuses?: IUpdateComplexTypeArrayInput<IBlockStatusInput>;
    boardLabels?: IUpdateComplexTypeArrayInput<IBlockLabelInput>;
    boardResolutions?: IUpdateComplexTypeArrayInput<
        IBoardStatusResolutionInput
    >;
    status?: string;
    taskResolution?: string;
    labels?: IUpdateComplexTypeArrayInput<IBlockAssignedLabelInput>;
    taskSprint?: ITaskSprintInput;
}

export interface IAddBlockAPIParams {
    block: IAddBlockAPINewBlockInput;
}

export type IAddBlockAPIResult = GetEndpointResult<{ block: IBlock }>;

export interface IUpdateBlockAPIParams {
    blockId: string;
    data: IUpdateBlockInput;
}

export type IUpdateBlockAPIResult = GetEndpointResult<{ block: IBlock }>;

export interface IDeleteBlockAPIParams {
    blockId: string;
}

export interface IGetBlockChildrenAPIParams {
    blockId: string;
    typeList?: BlockType[];
}

export type IGetBlockChildrenAPIResult = GetEndpointResult<{
    blocks: IBlock[];
}>;

export interface IAddCollaboratorAPIParams {
    blockId: string;
    collaborators: IAddCollaboratorFormItemValues[];
}

export type IAddCollaboratorAPIResult = GetEndpointResult<{
    requests: INotification[];
}>;

export interface IRemoveCollaboratorAPIParams {
    blockId: string;
    collaboratorId: string;
}

export type IGetUserRootBlocksAPIResult = GetEndpointResult<{
    requests: INotification[];
}>;

export interface IRevokeRequestAPIParams {
    blockId: string;
    requestId: string;
}
