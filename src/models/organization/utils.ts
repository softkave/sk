import { defaultTo } from "lodash";
import randomColor from "randomcolor";
import { IOrganizationFormValues } from "../../components/organization/OrganizationForm";
import { appLoggedInPaths } from "../app/routes";
import { IAppOrganization, IOrganization } from "./types";

export const appOrganizationRoutes = {
  organization: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}`,
  boards: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/boards`,
  requests: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/requests`,
  chats: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/chat`,
};

export function newFormOrganization() {
  const newOrganization: IOrganizationFormValues = {
    color: randomColor(),
    name: "",
    description: "",
  };

  return newOrganization;
}

export function formOrganizationFromExisting(org: IOrganization) {
  const newBoard: IOrganizationFormValues = {
    color: org.color,
    name: org.name,
    description: org.description,
  };

  return newBoard;
}

export function toAppOrganization(
  organization: IOrganization,
  extras: Partial<Omit<IAppOrganization, keyof IOrganization>> = {}
): IAppOrganization {
  return {
    ...organization,
    ...extras,
    collaboratorIds: defaultTo(extras.collaboratorIds, []),
  };
}
