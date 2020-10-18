export enum SprintDuration {
    OneWeek = "1 week",
    TwoWeeks = "2 weeks",
    OneMonth = "1 month",
}

export interface IBoardSprintOptions {
    duration: SprintDuration;
    updatedAt?: Date;
    updatedBy?: string;
    createdAt: Date;
    createdBy: string;
}

export interface ISprint {
    customId: string;
    boardId: string;
    orgId: string;
    duration: SprintDuration;
    sprintIndex: number;
    name?: string;
    startDate?: Date;
    startedBy?: string;
    endDate?: Date;
    endedBy?: string;
}
