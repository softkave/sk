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

export function getUserInitials(user: IUser) {
    return getNameInitials(user.name);
}
