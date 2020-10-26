export enum SprintDuration {
    ONE_WEEK = "1 week",
    TWO_WEEKS = "2 weeks",
    ONE_MONTH = "1 month",
}

export interface IBoardSprintOptions {
    duration: SprintDuration;
    updatedAt?: string;
    updatedBy?: string;
    createdAt: string;
    createdBy: string;
}

export interface ISprint {
    customId: string;
    boardId: string;
    orgId: string;
    duration: SprintDuration;
    sprintIndex: number;
    createdAt: string;
    createdBy: string;
    name: string;
    prevSprintId?: string;
    nextSprintId?: string;
    startDate?: string;
    startedBy?: string;
    endDate?: string;
    endedBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}
