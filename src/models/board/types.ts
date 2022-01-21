import { IUpdateComplexTypeArrayInput } from "../../utils/types";
import { BlockType, IBlockLabel, IBlockStatus } from "../block/block";
import { IBoardSprintOptions } from "../sprint/types";
import { IResourceWithId } from "../types";

export interface IBoardStatusResolution {
    customId: string;
    name: string;
    createdBy: string;
    createdAt: string;
    description?: string;
    updatedBy?: string;
    updatedAt?: string;
}

export interface IBoard {
    customId: string;
    createdBy: string;
    createdAt: string;
    type: BlockType.Board;
    name: string;
    description?: string;
    updatedAt?: string;
    updatedBy?: string;
    parent: string;
    rootBlockId: string;
    color: string;
    boardStatuses: Array<IBlockStatus>;
    boardLabels: IBlockLabel[];
    boardResolutions: IBoardStatusResolution[];
    currentSprintId?: string;
    sprintOptions?: IBoardSprintOptions;
    lastSprintId?: string;
}

export interface IBlockStatusInput extends IResourceWithId {
    name: string;
    color: string;
    position: number;
    description?: string;
}

export interface IBlockLabelInput extends IResourceWithId {
    name: string;
    color: string;
    description?: string;
}

export interface IBoardStatusResolutionInput extends IResourceWithId {
    name: string;
    description?: string;
}

export interface INewBoardInput {
    name: string;
    description?: string;
    color: string;
    parent: string;
    boardStatuses: IBlockStatusInput[];
    boardLabels: IBlockLabelInput[];
    boardResolutions: IBoardStatusResolutionInput[];
}

export interface IUpdateBoardInput {
    name?: string;
    description?: string;
    color?: string;
    boardStatuses?: IUpdateComplexTypeArrayInput<IBlockStatusInput>;
    boardLabels?: IUpdateComplexTypeArrayInput<IBlockLabelInput>;
    boardResolutions?: IUpdateComplexTypeArrayInput<IBoardStatusResolutionInput>;
}
