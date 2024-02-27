import { IResource, SystemResourceType } from "../app/types";

export interface INotificationEmailHistoryItem {
  date: string;
}

export const notificationEmailHistorySchema = {
  date: { type: Date },
};

export enum NotificationType {
  // Collaboration request
  CollaborationRequestReminder = "collaborationRequestReminder",
  CollaborationRequestResponse = "collaborationRequestResponse",
  CollaborationRequestUpdated = "collaborationRequestUpdated",
  CollaborationRequestRevoked = "collaborationRequestRevoked",

  // Task
  TaskAssigned = "taskAssigned",
  TaskUnassigned = "taskUnassigned",
  TaskCompleted = "taskCompleted",
  TaskUpdated = "taskUpdated",

  // Chat
  UnseenChats = "unseenChats",
}

export interface INotificationResourceAttachment {
  resourceType: SystemResourceType;
  resourceId: string;
}

export interface INotification extends IResource {
  recipientEmail: string;
  recipientId?: string;
  bodyText: string;
  bodyDelta: any;
  type: NotificationType;
  title: string;
  workspaceId?: string;
  subscriptionId?: string;
  readAt?: string;
  sentEmailHistory?: Array<INotificationEmailHistoryItem>;
  resourceAttachments?: Array<INotificationResourceAttachment>;
}
