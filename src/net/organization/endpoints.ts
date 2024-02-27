import * as yup from "yup";
import {
  INewOrganizationInput,
  IUpdateOrganizationInput,
  IWorkspace,
} from "../../models/organization/types";
import { yupObject } from "../../utils/validation";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult } from "../types";
import { endpointYupOptions } from "../utils";

const baseURL = "/organizations";

export type ICreateOrganizationEndpointParams = {
  organization: INewOrganizationInput;
};

export type ICreateOrganizationEndpointResult = GetEndpointResult<{
  organization: IWorkspace;
}>;

const createOrganizationYupSchema = yupObject<ICreateOrganizationEndpointParams>({
  organization: yupObject<ICreateOrganizationEndpointParams["organization"]>({
    name: yup.string().required(),
    description: yup.string(),
    color: yup.string().required(),
  }).required(),
});

async function createOrganization(props: ICreateOrganizationEndpointParams) {
  return invokeEndpointWithAuth<ICreateOrganizationEndpointResult>({
    path: `${baseURL}/createOrganization`,
    data: createOrganizationYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export type IGetUserOrganizationsEndpointResult = GetEndpointResult<{
  organizations: IWorkspace[];
}>;

async function getUserOrganizations() {
  return await invokeEndpointWithAuth<IGetUserOrganizationsEndpointResult>({
    path: `${baseURL}/getUserOrganizations`,
    apiType: "REST",
  });
}

export interface IWorkspaceExistsEndpointParams {
  name: string;
}

export type IWorkspaceExistsEndpointResult = GetEndpointResult<{
  exists: boolean;
}>;

const organizationExistsYupSchema = yupObject<IWorkspaceExistsEndpointParams>({
  name: yup.string().required(),
});

async function organizationExists(props: IWorkspaceExistsEndpointParams) {
  return await invokeEndpointWithAuth<IWorkspaceExistsEndpointResult>({
    path: `${baseURL}/organizationExists`,
    data: organizationExistsYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IUpdateOrganizationEndpointParams {
  organizationId: string;
  data: IUpdateOrganizationInput;
}

export type IUpdateOrganizationEndpointResult = GetEndpointResult<{
  organization: IWorkspace;
}>;

const updateOrganizationYupSchema = yupObject<IUpdateOrganizationEndpointParams>({
  organizationId: yup.string().required(),
  data: yupObject<IUpdateOrganizationEndpointParams["data"]>({
    name: yup.string(),
    description: yup.string(),
    color: yup.string(),
  }).required(),
});

async function updateOrganization(props: IUpdateOrganizationEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateOrganizationEndpointResult>({
    path: `${baseURL}/updateOrganization`,
    data: updateOrganizationYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export default class OrganizationAPI {
  static organizationExists = organizationExists;
  static createOrganization = createOrganization;
  static getUserOrganizations = getUserOrganizations;
  static updateOrganization = updateOrganization;
}
