import { BlockType } from "../../models/block/block";

export type BoardResourceType =
  | "groups"
  | "tasks"
  | "projects"
  | "collaborators"
  | "collaboration-requests";

export type BoardType = "kanban" | "list" | "tab";

export interface IBlockPathMatch {
  blockID: string;
}

export interface IBoardResourceTypePathMatch {
  resourceType: BoardResourceType;
}

export type CreateMenuKey = BlockType | "collaborator" | "status" | "label";
