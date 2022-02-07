import randomColor from "randomcolor";
import { IEditOrgFormValues } from "../../components/org/EditOrgForm";
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
  const newOrganization: IEditOrgFormValues = {
    color: randomColor(),
    name: "",
    description: "",
  };

  return newOrganization;
}

export function formOrganizationFromExisting(org: IOrganization) {
  const newBoard: IEditOrgFormValues = {
    color: org.color,
    name: org.name,
    description: org.description,
  };

  return newBoard;
}

export function toAppOrganization(
  organization: IOrganization
): IAppOrganization {
  return {
    ...organization,
    collaboratorIds: [],
  };
}
