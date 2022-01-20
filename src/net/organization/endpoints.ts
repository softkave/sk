import { IOrganization } from "../../models/organization/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult } from "../types";

const baseURL = "/api/organizations";

export type ICreateOrganizationEndpointParams = INewOrganizationInput;

export type ICreateOrganizationEndpointResult = GetEndpointResult<{
    organization: IOrganization;
}>;

async function createOrganization(props: ICreateOrganizationEndpointParams) {
    return invokeEndpointWithAuth<ICreateOrganizationEndpointResult>({
        path: `${baseURL}/createOrganization`,
        data: props,
    });
}

export type IGetUserOrganizationsEndpointResult = GetEndpointResult<{
    organization: IOrganization;
}>;

async function getUserOrganizations() {
    return await invokeEndpointWithAuth<IGetUserOrganizationsEndpointResult>({
        path: `${baseURL}/getUserOrganizations`,
    });
}

export interface IOrganizationExistsEndpointParams {
    organizationId: string;
}

export type IOrganizationExistsEndpointResult = GetEndpointResult<{
    organization: IRequestOrganization;
}>;

async function organizationExists(props: IOrganizationExistsEndpointParams) {
    return await invokeEndpointWithAuth<IOrganizationExistsEndpointResult>({
        path: `${baseURL}/organizationExists`,
        data: props,
    });
}

export interface IUpdateOrganizationEndpointParams {
    organizationId: string;
    organization: IUpdateOrganizationInput;
}

export type IUpdateOrganizationEndpointResult = GetEndpointResult<{
    organization: IOrganization;
}>;

async function updateOrganization(props: IUpdateOrganizationEndpointParams) {
    return await invokeEndpointWithAuth<IUpdateOrganizationEndpointResult>({
        path: `${baseURL}/updateOrganization`,
        data: props,
    });
}

export default class OrganizationAPI {
    public static addOrganization = addOrganization;
    public static deleteOrganization = deleteOrganization;
    public static getOrganization = getOrganization;
    public static getRequestOrganization = getRequestOrganization;
    public static getUserOrganizations = getUserOrganizations;
    public static updateOrganization = updateOrganization;
}
