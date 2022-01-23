import randomColor from "randomcolor";
import { appLoggedInPaths } from "../app/routes";
import {
  IAppOrganization,
  INewOrganizationInput,
  IOrganization,
} from "./types";

export const appOrganizationRoutes = {
  organization: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}`,
  boards: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/boards`,
  requests: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/requests`,
  chats: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/chats`,
};

export function newFormOrganization() {
  const newOrganization: INewOrganizationInput = {
    color: randomColor(),
    name: "",
    description: "",
  };

  return newOrganization;
}

export function toAppOrganization(
  organization: IOrganization
): IAppOrganization {
  return {
    ...organization,
    collaboratorIds: [],
  };
}
