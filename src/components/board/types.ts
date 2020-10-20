import { BlockType, IBlock } from "../../models/block/block";

export type BoardResourceType =
    | "tasks"
    | "boards"
    | "collaborators"
    | "collaboration-requests"
    | "chat";

export interface IBlockPathMatch {
    blockId: string;
}

export interface IBoardResourceTypePathMatch {
    resourceType: BoardResourceType;
}

export type OnClickBlock = (blocks: IBlock[]) => void;
export type OnClickBlockWithSearchParamKey = (
    blocks: IBlock[],
    searchParamKey?: string
) => void;
export type OnClickUpdateBlock = (block: IBlock) => void;
export type OnClickAddBlock = (parent: IBlock, type: BlockType) => void;
export type OnClickAddCollaborator = () => void;
export type OnClickAddOrEditLabel = () => void;
export type OnClickAddOrEditStatus = () => void;
export type OnClickDeleteBlock = (block: IBlock) => void;

export interface IBoardGroupedTasks {
    id: string;
    name: string;
    tasks: IBlock[];
    color?: string;
}
