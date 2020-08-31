import { BlockType } from "../block/block";

export const notificationSchemaVersion = 1; // increment when you make changes that are not backward compatible

export interface ICollaborationRequestFrom {
    userId: string;
    name: string;
    blockId: string;
    blockName: string;
    blockType: BlockType;
}

export interface INotificationTo {
    email: string;
}

export enum CollaborationRequestStatusType {
    Accepted = "accepted",
    Declined = "declined",
    Revoked = "revoked",
    Pending = "pending",
    Expired = "expired",
}

export interface ICollaborationRequestStatus {
    status: CollaborationRequestStatusType;
    date: string;
}

export interface INotificationSentEmailHistoryItem {
    date: string;
}

export enum NotificationType {
    CollaborationRequest = "collab-req",
    RemoveCollaborator = "remove-collaborator",
    OrgDeleted = "org-deleted",
}

export interface INotification {
    customId: string;
    to: INotificationTo;
    body: string;
    from?: ICollaborationRequestFrom;
    createdAt: string;
    type: NotificationType;
    readAt?: string;
    expiresAt?: string;
    statusHistory?: ICollaborationRequestStatus[];
    sentEmailHistory?: INotificationSentEmailHistoryItem[];
}
