import { IWorkspaceResource } from "../app/types";

export enum SprintDuration {
  OneWeek = "1 week",
  TwoWeeks = "2 weeks",
  OneMonth = "1 month",
}

export interface IBoardSprintOptions {
  duration: SprintDuration;
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
  createdAt: string;
  createdBy: string;
}

export interface ISprint extends IWorkspaceResource {
  boardId: string;
  duration: SprintDuration;
  name: string;
  sprintIndex: number;
  prevSprintId?: string;
  nextSprintId?: string;
  startDate?: string;
  startedBy?: string;
  endDate?: string;
  endedBy?: string;
}
