import { BlockType, IBlock } from "../../models/block/block";

export type BoardResourceType =
  | "groups"
  | "tasks"
  | "projects"
  | "collaborators"
  | "collaboration-requests";

export type BoardViewType = "group-kanban" | "status-kanban" | "list";

export interface IBlockPathMatch {
  blockID: string;
}

export interface IBoardResourceTypePathMatch {
  resourceType: BoardResourceType;
}

export type CreateMenuKey = BlockType | "collaborator" | "status" | "label";
export type OnClickBlock = (blocks: IBlock[]) => void;
export type OnClickBlockWithSearchParamKey = (
  blocks: IBlock[],
  searchParamKey?: string
) => void;
export type OnClickUpdateBlock = (block: IBlock) => void;
export type OnClickAddBlock = (block: IBlock, type: BlockType) => void;
export type OnClickAddCollaborator = () => void;
export type OnClickAddOrEditLabel = () => void;
export type OnClickAddOrEditStatus = () => void;
export type OnClickDeleteBlock = (block: IBlock) => void;
