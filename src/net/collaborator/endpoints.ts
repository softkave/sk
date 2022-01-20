import { ICollaborator } from "../../models/collaborator/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult } from "../types";

const baseURL = "/api/collaborators";

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
    });
}

export default class CollaboratorAPI {
    public static getOrganizationCollaborators = getOrganizationCollaborators;
    public static removeCollaborator = removeCollaborator;
}
