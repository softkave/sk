import {
  INewOrganizationInput,
  IOrganization,
  IUpdateOrganizationInput,
} from "../../models/organization/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult } from "../types";

const baseURL = "/organizations";

export type ICreateOrganizationEndpointParams = {
  organization: INewOrganizationInput;
};

export type ICreateOrganizationEndpointResult = GetEndpointResult<{
  organization: IOrganization;
}>;

async function createOrganization(props: ICreateOrganizationEndpointParams) {
  return invokeEndpointWithAuth<ICreateOrganizationEndpointResult>({
    path: `${baseURL}/createOrganization`,
    data: props,
    apiType: "REST",
  });
}

export type IGetUserOrganizationsEndpointResult = GetEndpointResult<{
  organizations: IOrganization[];
}>;

async function getUserOrganizations() {
  return await invokeEndpointWithAuth<IGetUserOrganizationsEndpointResult>({
    path: `${baseURL}/getUserOrganizations`,
    apiType: "REST",
  });
}

export interface IOrganizationExistsEndpointParams {
  name: string;
}

export type IOrganizationExistsEndpointResult = GetEndpointResult<{
  exists: boolean;
}>;

async function organizationExists(props: IOrganizationExistsEndpointParams) {
  return await invokeEndpointWithAuth<IOrganizationExistsEndpointResult>({
    path: `${baseURL}/organizationExists`,
    data: props,
    apiType: "REST",
  });
}

export interface IUpdateOrganizationEndpointParams {
  organizationId: string;
  data: IUpdateOrganizationInput;
}

export type IUpdateOrganizationEndpointResult = GetEndpointResult<{
  organization: IOrganization;
}>;

async function updateOrganization(props: IUpdateOrganizationEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateOrganizationEndpointResult>({
    path: `${baseURL}/updateOrganization`,
    data: props,
    apiType: "REST",
  });
}

export default class OrganizationAPI {
  public static organizationExists = organizationExists;
  public static createOrganization = createOrganization;
  public static getUserOrganizations = getUserOrganizations;
  public static updateOrganization = updateOrganization;
}