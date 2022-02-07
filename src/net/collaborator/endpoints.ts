import { ICollaborator } from "../../models/collaborator/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult } from "../types";

const baseURL = "/collaborators";

export type IGetOrganizationCollaboratorsEndpointParams = {
  organizationId: string;
};

export type IGetOrganizationCollaboratorsEndpointResult = GetEndpointResult<{
  collaborators: ICollaborator[];
}>;

async function getOrganizationCollaborators(
  props: IGetOrganizationCollaboratorsEndpointParams
) {
  return invokeEndpointWithAuth<IGetOrganizationCollaboratorsEndpointResult>({
    path: `${baseURL}/getOrganizationCollaborators`,
    data: props,
    apiType: "REST",
  });
}

export interface IRemoveCollaboratorEndpointParams {
  organizationId: string;
  collaboratorId: string;
}

export type IRemoveCollaboratorEndpointResult = GetEndpointResult<{
  exists: boolean;
}>;

async function removeCollaborator(props: IRemoveCollaboratorEndpointParams) {
  return await invokeEndpointWithAuth<IRemoveCollaboratorEndpointResult>({
    path: `${baseURL}/removeCollaborator`,
    data: props,
    apiType: "REST",
  });
}

export default class CollaboratorAPI {
  public static getOrganizationCollaborators = getOrganizationCollaborators;
  public static removeCollaborator = removeCollaborator;
}
