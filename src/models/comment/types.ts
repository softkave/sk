export interface IComment {
    customId: string;
    taskId: string;
    boardId: string;
    orgId: string;
    comment: string;
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
    updatedBy?: string;

    sending?: boolean;
    queued?: boolean;
    errorMessage?: string;
}
