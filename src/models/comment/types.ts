export interface IComment {
    customId: string;
    taskId: string;
    comment: string;
    createdBy: string;
    createdAt: Date;
    updatedAt?: Date;
    updatedBy?: string;
}
