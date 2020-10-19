export enum SprintDuration {
    OneWeek = "1 week",
    TwoWeeks = "2 weeks",
    OneMonth = "1 month",
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
    name?: string;
    startDate?: string;
    startedBy?: string;
    endDate?: string;
    endedBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}
