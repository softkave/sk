import * as yup from "yup";
import {
  CollaborationRequestResponse,
  ICollaborationRequest,
  INewCollaboratorInput,
} from "../../models/collaborationRequest/types";
import { IWorkspace } from "../../models/organization/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult } from "../types";
import { endpointYupOptions } from "../utils";

const baseURL = "/collaborationRequests";

export type IAddCollaboratorsEndpointParams = {
  organizationId: string;
  collaborators: INewCollaboratorInput[];
};

export type IAddCollaboratorsEndpointResult = GetEndpointResult<{
  requests: ICollaborationRequest[];
}>;

const addCollaboratorsYupSchema = yup.object().shape({
  organizationId: yup.string().required(),
  collaborators: yup
    .array()
    .of(yup.object().shape({ email: yup.string().required() }))
    .required(),
});

async function addCollaborators(props: IAddCollaboratorsEndpointParams) {
  return invokeEndpointWithAuth<IAddCollaboratorsEndpointResult>({
    path: `${baseURL}/addCollaborators`,
    data: addCollaboratorsYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export type IGetOrganizationRequestsEndpointParams = {
  organizationId: string;
};

export type IGetOrganizationRequestsEndpointResult = GetEndpointResult<{
  requests: ICollaborationRequest[];
}>;

const getOrganizationRequestsYupSchema = yup.object().shape({
  organizationId: yup.string().required(),
});

async function getOrganizationRequests(props: IGetOrganizationRequestsEndpointParams) {
  return invokeEndpointWithAuth<IGetOrganizationRequestsEndpointResult>({
    path: `${baseURL}/getOrganizationRequests`,
    data: getOrganizationRequestsYupSchema.validateSync(props, endpointYupOptions),
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

const markRequestReadYupSchema = yup.object().shape({
  requestId: yup.string().required(),
});

async function markRequestRead(props: IMarkRequestReadEndpointParams) {
  return invokeEndpointWithAuth<IMarkRequestReadEndpointResult>({
    path: `${baseURL}/markRequestRead`,
    data: markRequestReadYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export type IRespondToRequestEndpointParams = {
  requestId: string;
  response: CollaborationRequestResponse;
};

export type IRespondToRequestEndpointResult = GetEndpointResult<{
  organization?: IWorkspace;
  respondedAt: string;
  request: ICollaborationRequest;
}>;

const respondToRequestYupSchema = yup.object().shape({
  requestId: yup.string().required(),
  response: yup.string().required(),
});

async function respondToRequest(props: IRespondToRequestEndpointParams) {
  return invokeEndpointWithAuth<IRespondToRequestEndpointResult>({
    path: `${baseURL}/respondToRequest`,
    data: respondToRequestYupSchema.validateSync(props, endpointYupOptions),
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

const revokeRequestYupSchema = yup.object().shape({
  requestId: yup.string().required(),
  organizationId: yup.string().required(),
});

async function revokeRequest(props: IRevokeRequestEndpointParams) {
  return invokeEndpointWithAuth<IRevokeRequestEndpointResult>({
    path: `${baseURL}/revokeRequest`,
    data: revokeRequestYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export default class CollaborationRequestAPI {
  static addCollaborators = addCollaborators;
  static revokeRequest = revokeRequest;
  static respondToRequest = respondToRequest;
  static markRequestRead = markRequestRead;
  static getUserRequests = getUserRequests;
  static getOrganizationRequests = getOrganizationRequests;
}
