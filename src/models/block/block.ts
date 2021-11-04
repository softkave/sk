import randomColor from "randomcolor";
import { IOperation } from "../../redux/operations/operation";
import {
    extractFields,
    getFields,
    makeExtract,
    makeListExtract,
} from "../../utils/extract";
import { IUpdateComplexTypeArrayInput } from "../../utils/types";
import { topLevelDiff } from "../../utils/utils";
import { IBoardSprintOptions } from "../sprint/types";
import { IUser } from "../user/user";
import { getComplexFieldInput, getNameInitials } from "../utils";
import { getDefaultStatuses } from "./utils";

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

export interface IAssigneeInput {
    userId: string;
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

export interface IBlockAssignedLabelInput {
    customId: string;
}

export interface ITaskSprintInput {
    sprintId: string;
}

export interface INewBlockInput {
    type: BlockType;
    name: string;
    description?: string;
    dueAt?: string;
    color?: string;
    parent?: string;
    rootBlockId?: string;
    assignees?: IAssigneeInput[];
    priority?: BlockPriority;
    subTasks?: ISubTaskInput[];
    boardStatuses?: IBlockStatusInput[];
    boardLabels?: IBlockLabelInput[];
    boardResolutions?: IBoardStatusResolutionInput[];
    status?: string | null;
    labels?: IBlockAssignedLabelInput[];
    taskResolution?: string | null;
    taskSprint?: ITaskSprintInput | null;
}

export interface IFormBlock extends INewBlockInput {
    subTasks?: ISubTaskInput[];
    boardStatuses?: IBlockStatusInput[];
    boardLabels?: IBlockLabelInput[];
    boardResolutions?: IBoardStatusResolutionInput[];
}

export function findBlock(blocks: IBlock[], id: string): IBlock | undefined {
    return blocks.find((block) => {
        return block.customId === id;
    });
}

const assigneeInputFields = getFields<IAssigneeInput>({
    userId: true,
});

const subTaskInputFields = getFields<ISubTaskInput>({
    completedBy: true,
    description: true,
    customId: true,
});

const statusInputFields = getFields<IBlockStatusInput>({
    color: true,
    description: true,
    name: true,
    customId: true,
    position: true,
});

const labelInputFields = getFields<IBlockLabelInput>({
    color: true,
    description: true,
    name: true,
    customId: true,
});

const resolutionInputFields = getFields<IBoardStatusResolutionInput>({
    description: true,
    name: true,
    customId: true,
});

const taskLabelInputFields = getFields<IBlockAssignedLabelInput>({
    customId: true,
});

const taskSprintInputFields = getFields<ITaskSprintInput>({
    sprintId: true,
});

export const assigneeInputExtractor = makeExtract(assigneeInputFields);
export const assigneeInputListExtractor = makeListExtract(assigneeInputFields);
export const subTaskInputExtractor = makeExtract(subTaskInputFields);
export const subTaskInputListExtractor = makeListExtract(subTaskInputFields);
export const statusInputExtractor = makeExtract(statusInputFields);
export const statusInputListExtractor = makeListExtract(statusInputFields);
export const labelInputExtractor = makeExtract(labelInputFields);
export const labelInputListExtractor = makeListExtract(labelInputFields);
export const resolutionInputExtractor = makeExtract(resolutionInputFields);
export const resolutionInputListExtractor = makeListExtract(
    resolutionInputFields
);
export const taskLabelInputExtractor = makeExtract(taskLabelInputFields);
export const taskLabelInputListExtractor =
    makeListExtract(taskLabelInputFields);
export const taskSprintInputExtractor = makeExtract(taskSprintInputFields);

const newBlockInputFields = getFields<IFormBlock, INewBlockInput>({
    type: true,
    name: true,
    description: true,
    dueAt: true,
    color: true,
    parent: true,
    rootBlockId: true,
    assignees: assigneeInputListExtractor,
    priority: true,
    subTasks: subTaskInputListExtractor,
    boardStatuses: statusInputListExtractor,
    boardLabels: labelInputListExtractor,
    boardResolutions: resolutionInputListExtractor,
    status: true,
    taskResolution: true,
    labels: taskLabelInputListExtractor,
    taskSprint: taskSprintInputExtractor,
});

export const newBlockInputExtractor = makeExtract(newBlockInputFields);

export interface IUpdateBlockInput {
    name?: string;
    description?: string;
    color?: string;
    priority?: string;
    parent?: string;
    subTasks?: IUpdateComplexTypeArrayInput<ISubTaskInput>;
    dueAt?: string;
    assignees?: IUpdateComplexTypeArrayInput<IAssigneeInput>;
    boardStatuses?: IUpdateComplexTypeArrayInput<IBlockStatusInput>;
    boardLabels?: IUpdateComplexTypeArrayInput<IBlockLabelInput>;
    boardResolutions?: IUpdateComplexTypeArrayInput<IBoardStatusResolutionInput>;
    status?: string;
    taskResolution?: string;
    labels?: IUpdateComplexTypeArrayInput<IBlockAssignedLabelInput>;
    taskSprint?: ITaskSprintInput;
}

const updateBlockFields = getFields<
    Omit<IFormBlock, "type" | "rootBlockId">,
    IUpdateBlockInput,
    { block: IBlock }
>({
    name: true,
    description: true,
    dueAt: true,
    color: true,
    parent: true,
    assignees: (data, args) => {
        return getComplexFieldInput(
            args.block.assignees || [],
            data,
            "userId",
            (d) => d,
            (d0, d1) => false,
            assigneeInputExtractor
        );
    },
    priority: true,
    subTasks: (data, args) => {
        return getComplexFieldInput(
            args.block.subTasks || [],
            data,
            "customId",
            (d) => ({
                ...d,
                description: d.description.toLowerCase(),
            }),
            (d0, d1) =>
                d1.description.toLowerCase() !== d0.description ||
                d1.completedBy !== d0.completedBy,
            subTaskInputExtractor
        );
    },
    boardStatuses: (data, args) => {
        const d0 = getComplexFieldInput(
            args.block.boardStatuses || [],
            data,
            "customId",
            (d) => ({
                ...d,
                name: d.name.toLowerCase(),
                description: d.description?.toLowerCase(),
            }),
            (d0, d1) =>
                d1.name.toLowerCase() !== d0.name ||
                d1.color !== d0.color ||
                d1.position !== d0.position ||
                d1.description?.toLowerCase() !== d0.description,
            statusInputExtractor
        );

        return d0;
    },
    boardLabels: (data, args) => {
        return getComplexFieldInput(
            args.block.boardLabels || [],
            data,
            "customId",
            (d) => ({
                ...d,
                name: d.name.toLowerCase(),
                description: d.description?.toLowerCase(),
            }),
            (d0, d1) =>
                d1.name.toLowerCase() !== d0.name ||
                d1.color !== d0.color ||
                d1.description?.toLowerCase() !== d0.description,
            labelInputExtractor
        );
    },
    boardResolutions: (data, args) => {
        return getComplexFieldInput(
            args.block.boardResolutions || [],
            data,
            "customId",
            (d) => ({
                ...d,
                name: d.name.toLowerCase(),
                description: d.description?.toLowerCase(),
            }),
            (d0, d1) =>
                d1.name.toLowerCase() !== d0.name ||
                d1.description?.toLowerCase() !== d0.description,
            resolutionInputExtractor
        );
    },
    status: true,
    taskResolution: true,
    labels: (data, args) => {
        return getComplexFieldInput(
            args.block.labels || [],
            data,
            "customId",
            (d) => d,
            (d0, d1) => false,
            taskLabelInputExtractor
        );
    },
    taskSprint: taskSprintInputExtractor,
});

export function getUpdateBlockInput(
    block: IBlock,
    formBlock: Partial<IFormBlock>
) {
    const b1 = topLevelDiff(formBlock, block);
    return extractFields(b1, updateBlockFields, { block });
}

export function persistedBlockToBlock(pBlock: IPersistedBlock): IBlock {
    return {
        ...pBlock,
        boards: [],
        collaborators: [],
        notifications: [],
    };
}

export function newFormBlock(user: IUser, type: BlockType, parent?: IBlock) {
    const isTask = type === BlockType.Task;
    const isBoard = type === BlockType.Board;

    if ((isTask || isBoard) && !parent) {
        throw new Error("Block parent not provided");
    }

    const newBlock: IFormBlock = {
        type,
        color: randomColor(),
        parent: parent ? parent.customId : undefined,
        rootBlockId: parent
            ? parent.type === BlockType.Org
                ? parent.customId
                : parent.rootBlockId
            : undefined,
        assignees: [],
        name: "",
        description: undefined,
        dueAt: undefined,
        priority: isTask ? BlockPriority.Important : undefined,
        boardLabels: [],
        boardStatuses: isBoard ? getDefaultStatuses(user) : [],
        boardResolutions: [],
        subTasks: [],
        status:
            isTask &&
            parent &&
            parent.boardStatuses &&
            parent?.boardStatuses?.length > 0
                ? parent?.boardStatuses[0].customId
                : undefined,
        labels: [],
    };

    return newBlock;
}

export function getBlockInitials(block: IBlock) {
    return getNameInitials(block.name || "");
}
