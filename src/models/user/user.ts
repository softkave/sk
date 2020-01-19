export interface IUserRole {
  roleName: string;
  orgId: string;
  assignedAt: number;
  assignedBy: string;
  customId: string;
}

export interface IUser {
  customId: string;
  name: string;
  email: string;
  hash: string;
  createdAt: number;
  forgotPasswordHistory: number[];
  changePasswordHistory: number[];
  lastNotificationCheckTime: number;
  rootBlockId: string;
  orgs: string[];
  color: string;
  roles: IUserRole[];
  notifications?: string[];
  assignedTasks?: string[];
}

export interface IUserSessionDetails {
  notificationsCount: number;
  unseenNotificationsCount: number;
  organizationsCount: number;
  unseenOrganizationsCount: number;
  assignedTasksCount: number;
  unseenAssignedTasksCount: number;
}
