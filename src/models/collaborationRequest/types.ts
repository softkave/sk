import { IWorkspaceResource } from "../app/types";
import { INotificationEmailHistoryItem } from "../notification/notification";

export interface ICollaborationRequestFrom {
  userId: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
}

export interface ICollaborationRequestRecipient {
  email: string;
}

export enum CollaborationRequestStatusType {
  Accepted = "accepted",
  Declined = "declined",
  Revoked = "revoked",
  Pending = "pending",
  // Expired = "expired",
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

export interface ICollaborationRequestSentEmailHistoryItem extends INotificationEmailHistoryItem {
  reason: CollaborationRequestEmailReason;
}

export interface ICollaborationRequest extends IWorkspaceResource {
  to: ICollaborationRequestRecipient;
  title: string;
  body?: string;
  from: ICollaborationRequestFrom;
  expiresAt?: string;
  readAt?: string;
  statusHistory: Array<ICollaborationRequestStatus>;
  sentEmailHistory: Array<ICollaborationRequestSentEmailHistoryItem>;
}

export interface INewCollaboratorInput {
  email: string;
}
