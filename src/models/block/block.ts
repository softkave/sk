import { IBoardSprintOptions } from "../sprint/types";

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

export interface IBlock {
    customId: string;
    createdBy: string;
    createdAt: string;
    type: BlockType;
    name?: string;
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
    boardResolutions?: IBoardTaskResolution[];
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: string;
    taskResolution?: string | null;
    labels?: IBlockAssignedLabel[];
    currentSprintId?: string | null;
    sprintOptions?: IBoardSprintOptions;
    taskSprint?: ITaskSprint | null;

    boards?: string[];
    collaborators?: string[];
    notifications?: string[];
}

// const blockFieldsToBlockTypes: {
//     [key in keyof IBlock]: BlockType[];
// } = {
//     customId: [BlockType.Org, BlockType.Board, BlockType.Task],
//     createdBy: [BlockType.Org, BlockType.Board, BlockType.Task],
//     createdAt: [BlockType.Org, BlockType.Board, BlockType.Task],
//     type: [BlockType.Org, BlockType.Board, BlockType.Task],
//     name: [BlockType.Org, BlockType.Board, BlockType.Task],
//     description: [BlockType.Org, BlockType.Board, BlockType.Task],
//     dueAt: [BlockType.Task],
//     color: [BlockType.Org, BlockType.Board],
//     updatedAt: [BlockType.Org, BlockType.Board, BlockType.Task],
//     updatedBy: [BlockType.Org, BlockType.Board, BlockType.Task],
//     parent: [BlockType.Board, BlockType.Task],
//     rootBlockId: [BlockType.Board, BlockType.Task],
//     assignees: [BlockType.Task],
//     priority: [BlockType.Task],
//     subTasks: [BlockType.Task],
//     boardStatuses: [BlockType.Board],
//     boardLabels: [BlockType.Board],
//     boardResolutions: [BlockType.Board],
//     status: [BlockType.Task],
//     statusAssignedBy: [BlockType.Task],
//     statusAssignedAt: [BlockType.Task],
//     taskResolution: [BlockType.Task],
//     labels: [BlockType.Task],
//     currentSprintId: [BlockType.Board],
//     sprintOptions: [BlockType.Board],
//     taskSprint: [BlockType.Task],

//     boards: [BlockType.Org],
//     collaborators: [BlockType.Org],
//     notifications: [BlockType.Org],
// };

// function getFieldNames(type: BlockType) {
//     return Object.keys(blockFieldsToBlockTypes).filter((field) => {
//         const inBlockTypes: BlockType[] = blockFieldsToBlockTypes[field];
//         return inBlockTypes.includes(type);
//     });
// }

// export const orgFields = getFieldNames(BlockType.Org);
// export const boardFields = getFieldNames(BlockType.Board);
// export const taskFields = getFieldNames(BlockType.Task);

export function findBlock(blocks: IBlock[], id: string): IBlock | undefined {
    return blocks.find((block) => {
        return block.customId === id;
    });
}
