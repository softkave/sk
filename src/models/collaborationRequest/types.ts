import { BlockType } from "../block/block";
import { INotificationSentEmailHistoryItem } from "../notification/notification";

export interface ICollaborationRequestFrom {
    userId: string;
    name: string;
    blockId: string;
    blockName: string;
    blockType: BlockType;
}

export interface ICollaborationRequestRecipient {
    email: string;
}

export enum CollaborationRequestStatusType {
    Accepted = "accepted",
    Declined = "declined",
    Revoked = "revoked",
    Pending = "pending",
}

export type CollaborationRequestResponse =
    | CollaborationRequestStatusType.Accepted
    | CollaborationRequestStatusType.Declined;

export interface ICollaborationRequestStatus {
    status: CollaborationRequestStatusType;
    date: string;
}

export enum CollaborationRequestEmailReason {
    RequestNotification = "requestNotification",
    RequestRevoked = "requestRevoked",
    RequestUpdated = "requestUpdated",
}

export interface ICollaborationRequestSentEmailHistoryItem
    extends INotificationSentEmailHistoryItem {
    reason: CollaborationRequestEmailReason;
}

export interface ICollaborationRequest {
    customId: string;
    to: ICollaborationRequestRecipient;
    title: string;
    body?: string;
    from: ICollaborationRequestFrom;
    createdAt: string;
    expiresAt?: string;
    readAt?: string;
    statusHistory: ICollaborationRequestStatus[];
    sentEmailHistory: ICollaborationRequestSentEmailHistoryItem[];
}

export interface INewCollaboratorInput {
    email: string;
}
