import { BlockType } from "../../models/block/block";

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
