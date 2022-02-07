import {
  INewCollaboratorInput,
  ICollaborationRequest,
} from "../../models/collaborationRequest/types";
import { CollaborationRequestResponse } from "../../models/notification/notification";
import { IOrganization } from "../../models/organization/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult } from "../types";

const baseURL = "/collaborationRequests";

export type IAddCollaboratorsEndpointParams = {
  organizationId: string;
  collaborators: INewCollaboratorInput[];
};

export type IAddCollaboratorsEndpointResult = GetEndpointResult<{
  requests: ICollaborationRequest[];
}>;

async function addCollaborators(props: IAddCollaboratorsEndpointParams) {
  return invokeEndpointWithAuth<IAddCollaboratorsEndpointResult>({
    path: `${baseURL}/addCollaborators`,
    data: props,
    apiType: "REST",
  });
}

export type IGetOrganizationRequestsEndpointParams = {
  organizationId: string;
};

export type IGetOrganizationRequestsEndpointResult = GetEndpointResult<{
  requests: ICollaborationRequest[];
}>;

async function getOrganizationRequests(
  props: IGetOrganizationRequestsEndpointParams
) {
  return invokeEndpointWithAuth<IGetOrganizationRequestsEndpointResult>({
    path: `${baseURL}/getOrganizationRequests`,
    data: props,
    apiType: "REST",
  });
}

export type IGetUserRequestsEndpointResult = GetEndpointResult<{
  requests: ICollaborationRequest[];
}>;

async function getUserRequests() {
  return invokeEndpointWithAuth<IGetUserRequestsEndpointResult>({
    path: `${baseURL}/getUserRequests`,
    apiType: "REST",
  });
}

export type IMarkRequestReadEndpointParams = {
  requestId: string;
};

export type IMarkRequestReadEndpointResult = GetEndpointResult<{
  request: ICollaborationRequest;
}>;

async function markRequestRead(props: IMarkRequestReadEndpointParams) {
  return invokeEndpointWithAuth<IMarkRequestReadEndpointResult>({
    path: `${baseURL}/markRequestRead`,
    data: props,
    apiType: "REST",
  });
}

export type IRespondToRequestEndpointParams = {
  requestId: string;
  response: CollaborationRequestResponse;
};

export type IRespondToRequestEndpointResult = GetEndpointResult<{
  organization?: IOrganization;
  respondedAt: string;
}>;

async function respondToRequest(props: IRespondToRequestEndpointParams) {
  return invokeEndpointWithAuth<IRespondToRequestEndpointResult>({
    path: `${baseURL}/respondToRequest`,
    data: props,
    apiType: "REST",
  });
}

export type IRevokeRequestEndpointParams = {
  requestId: string;
  organizationId: string;
};

export type IRevokeRequestEndpointResult = GetEndpointResult<{
  request: ICollaborationRequest;
}>;

async function revokeRequest(props: IRevokeRequestEndpointParams) {
  return invokeEndpointWithAuth<IRevokeRequestEndpointResult>({
    path: `${baseURL}/revokeRequest`,
    data: props,
    apiType: "REST",
  });
}

export default class CollaborationRequestAPI {
  public static addCollaborators = addCollaborators;
  public static revokeRequest = revokeRequest;
  public static respondToRequest = respondToRequest;
  public static markRequestRead = markRequestRead;
  public static getUserRequests = getUserRequests;
  public static getOrganizationRequests = getOrganizationRequests;
}
