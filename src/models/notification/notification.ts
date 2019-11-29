const accepted = "accepted";
const declined = "declined";
const revoked = "revoked";

const collabReq = "collab-req";
const removeCollaborator = "remove-collaborator";

export const notificationType = {
  collabReq: collabReq as NotificationType,
  removeCollaborator: removeCollaborator as NotificationType
};

export const notificationStatus = {
  accepted: accepted as NotificationStatusText,
  declined: declined as NotificationStatusText,
  revoked: revoked as NotificationStatusText
};

export type NotificationType = typeof collabReq | typeof removeCollaborator;
export type NotificationStatusText =
  | typeof accepted
  | typeof declined
  | typeof revoked;

export interface INotificationFrom {
  userId: string;
  name: string;
  blockId: string;
  blockName: string;
  blockType: string;
}

export interface INotificationTo {
  email: string;
  userId?: string;
}

export interface INotificationStatusHistory {
  status: NotificationStatusText;
  date: number;
}

export interface INotificationSentEmailHistory {
  date: number;
}

export interface INotification {
  customId: string;
  from: INotificationFrom;
  createdAt: number;
  body: string;
  to: INotificationTo;
  expiresAt?: number;
  type: NotificationType;
  statusHistory: INotificationStatusHistory[];
  sentEmailHistory: INotificationSentEmailHistory[];
  root?: string;
  readAt?: number;
}
