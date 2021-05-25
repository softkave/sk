import { getNameInitials } from "../utils";

export const userSchemaVersion = 2; // TODO: increment when you make changes that are not backward compatible

export interface IUserOrg {
    customId: string;
}

export interface IUser {
    customId: string;
    name: string;
    email: string;
    createdAt: string;
    rootBlockId: string;
    orgs: IUserOrg[];
    color: string;
    notificationsLastCheckedAt?: string;

    notifications?: string[];
}

export type ICollaborator = {
    customId: string;
    name: string;
    email: string;
    orgs: IUserOrg[];
    imageURL?: string;
    color: string;
};

export interface IPersistedClient {
    clientId: string;
    hasUserSeenNotificationsPermissionDialog?: boolean;
    muteChatNotifications?: boolean;
    isLoggedIn?: boolean;
}

export interface IClient extends IPersistedClient {
    isSubcribedToPushNotifications?: boolean;
}

export function getUserInitials(user: ICollaborator) {
    return getNameInitials(user.name);
}
