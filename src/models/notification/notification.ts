export interface INotificationFrom {
  userId: string;
  name: string;
  blockId: string;
  blockName: string;
  blockType: string;
}

export interface INotificationTo {
  email: string;
  userId: string;
}

export interface INotificationStatusHistory {
  status: string;
  date: number;
}

export interface INotificationSentEmailHistory {
  date: number;
}

export type NotificationType = "collab-req" | "remove-collaborator";

export interface INotification {
  customId: string;
  from: INotificationFrom;
  createdAt: string;
  body: string;
  readAt: number;
  to: INotificationTo;
  expiresAt: number;
  type: NotificationType;
  statusHistory: INotificationStatusHistory;
  sentEmailHistory: INotificationSentEmailHistory;
  root: string;
}
