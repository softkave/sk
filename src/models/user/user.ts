export const userSchemaVersion = 2; // increment when you make changes that are not backward compatible

export interface IUserOrg {
  customId: string;
}

export interface IUser {
  customId: string;
  name: string;
  email: string;
  createdAt: string;
  forgotPasswordHistory: string[];
  passwordLastChangedAt: string;
  rootBlockId: string;
  orgs: IUserOrg[];
  color: string;
  notificationsLastCheckedAt?: string;

  notifications?: string[];
}
