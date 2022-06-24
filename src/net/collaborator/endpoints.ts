import * as yup from "yup";
import { ICollaborator } from "../../models/collaborator/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult } from "../types";
import { endpointYupOptions } from "../utils";

const baseURL = "/collaborators";

export type IGetOrganizationCollaboratorsEndpointParams = {
  organizationId: string;
};

export type IGetOrganizationCollaboratorsEndpointResult = GetEndpointResult<{
  collaborators: ICollaborator[];
}>;

const getOrganizationCollaboratorsYupSchema = yup.object().shape({
  organizationId: yup.string().required(),
});

async function getOrganizationCollaborators(
  props: IGetOrganizationCollaboratorsEndpointParams
) {
  return invokeEndpointWithAuth<IGetOrganizationCollaboratorsEndpointResult>({
    path: `${baseURL}/getOrganizationCollaborators`,
    data: getOrganizationCollaboratorsYupSchema.validateSync(
      props,
      endpointYupOptions
    ),
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

const removeCollaboratorYupSchema = yup.object().shape({
  organizationId: yup.string().required(),
  collaboratorId: yup.string().required(),
});

async function removeCollaborator(props: IRemoveCollaboratorEndpointParams) {
  return await invokeEndpointWithAuth<IRemoveCollaboratorEndpointResult>({
    path: `${baseURL}/removeCollaborator`,
    data: removeCollaboratorYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export default class CollaboratorAPI {
  public static getOrganizationCollaborators = getOrganizationCollaborators;
  public static removeCollaborator = removeCollaborator;
}
