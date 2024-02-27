import { IResource } from "../app/types";

export interface IUserOrganization {
  customId: string;
}

export interface IUser extends IResource {
  lastName: string;
  firstName: string;
  email: string;
  workspaces: Array<IUserOrganization>;
  color: string;
  notificationsLastCheckedAt?: string;
  isAnonymousUser?: boolean;
}

export interface IPersistedClient {
  customId: string;
  hasUserSeenNotificationsPermissionDialog?: boolean;
  muteChatNotifications?: boolean;
  isLoggedIn?: boolean;
}

export interface IClient extends IPersistedClient {
  isSubcribedToPushNotifications?: boolean;
}
