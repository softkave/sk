import * as yup from "yup";
import {
  INewOrganizationInput,
  IOrganization,
  IUpdateOrganizationInput,
} from "../../models/organization/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult } from "../types";
import { endpointYupOptions } from "../utils";

const baseURL = "/organizations";

export type ICreateOrganizationEndpointParams = {
  organization: INewOrganizationInput;
};

export type ICreateOrganizationEndpointResult = GetEndpointResult<{
  organization: IOrganization;
}>;

const createOrganizationYupSchema = yup.object().shape({
  organization: yup
    .object()
    .shape({
      name: yup.string().required(),
      description: yup.string(),
      color: yup.string().required(),
    })
    .required(),
});

async function createOrganization(props: ICreateOrganizationEndpointParams) {
  return invokeEndpointWithAuth<ICreateOrganizationEndpointResult>({
    path: `${baseURL}/createOrganization`,
    data: createOrganizationYupSchema.validateSync(props, endpointYupOptions),
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

const organizationExistsYupSchema = yup.object().shape({
  name: yup.string().required(),
});

async function organizationExists(props: IOrganizationExistsEndpointParams) {
  return await invokeEndpointWithAuth<IOrganizationExistsEndpointResult>({
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
  organization: IOrganization;
}>;

const updateOrganizationYupSchema = yup.object().shape({
  organizationId: yup.string().required(),
  data: yup
    .object()
    .shape({
      name: yup.string(),
      description: yup.string(),
      color: yup.string(),
    })
    .required(),
});

async function updateOrganization(props: IUpdateOrganizationEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateOrganizationEndpointResult>({
    path: `${baseURL}/updateOrganization`,
    data: updateOrganizationYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export default class OrganizationAPI {
  public static organizationExists = organizationExists;
  public static createOrganization = createOrganization;
  public static getUserOrganizations = getUserOrganizations;
  public static updateOrganization = updateOrganization;
}
