import { ITask } from "../../models/task/types";

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

export type BoardGroupableFields = "assignees" | "labels" | "status" | "sprint";

export interface IBoardGroupedTasks {
  id: string;
  name: string;
  tasks: ITask[];
  color?: string;
}
