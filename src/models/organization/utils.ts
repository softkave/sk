import { defaultTo } from "lodash";
import randomColor from "randomcolor";
import { IWorkspaceFormValues } from "../../components/organization/OrganizationForm";
import { IAppWorkspace, IWorkspace } from "./types";

export function newFormOrganization() {
  const newOrganization: IWorkspaceFormValues = {
    color: randomColor(),
    name: "",
    description: "",
  };

  return newOrganization;
}

export function formOrganizationFromExisting(org: IWorkspace) {
  const newBoard: IWorkspaceFormValues = {
    color: org.color,
    name: org.name,
    description: org.description,
  };

  return newBoard;
}

export function toAppOrganization(
  organization: IWorkspace,
  extras: Partial<Omit<IAppWorkspace, keyof IWorkspace>> = {}
): IAppWorkspace {
  return {
    ...organization,
    ...extras,
    collaboratorIds: defaultTo(extras.collaboratorIds, []),
    boardIds: defaultTo(extras.boardIds, []),
  };
}
