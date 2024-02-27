import * as yup from "yup";
import { IResourceWithDescriptor } from "../models/app/types";
import {
  IPermissionGroup,
  IPermissionGroupContainer,
  IPermissionGroupInput,
  IPermissionGroupWithAssignedInfo,
  IPermissionItemEntity,
} from "../models/permissions/types";
import { IPaginatedResult } from "../models/types";
import { skValidationSchemas } from "../models/validation";
import { yupObject } from "../utils/validation";
import { invokeEndpointWithAuth } from "./invokeEndpoint";
import { IEndpointResultBase } from "./types";
import { endpointYupOptions } from "./utils";

const baseURL = "/permissionGroups";

export interface ICreatePermissionGroupEndpointParameters {
  organizationId: string;
  permissionGroup: IPermissionGroupInput;
}
export interface ICreatePermissionGroupEndpointResult extends IEndpointResultBase {
  permissionGroup: IPermissionGroup;
}

export type IAssignPermissionGroupInputItem = {
  permissionGroupId: string;
  entity: Required<IPermissionItemEntity>;
  order?: number;
};
export interface IAssignPermissionGroupsEndpointParameters {
  organizationId: string;
  items: IAssignPermissionGroupInputItem[];
}

export interface IDeletePermissionGroupsEndpointParameters {
  workspaceId: string;
  permissionGroupIds: string[];
}

export interface IGetAssignedPermissionGroupListEndpointParameters {
  organizationId: string;
  container: IPermissionGroupContainer;
  entity: IPermissionItemEntity;
}
export interface IGetAssignedPermissionGroupListEndpointResult extends IEndpointResultBase {
  permissionGroups: Array<IPermissionGroupWithAssignedInfo>;
}

export interface IGetContainerPermissionGroupListEndpointParameters {
  workspaceId: string;
  container: IPermissionGroupContainer;
}
export interface IGetContainerPermissionGroupListEndpointResult
  extends IPaginatedResult,
    IEndpointResultBase {
  permissionGroups: IPermissionGroup[];
}

export interface IGetPermissionGroupAssigneesEndpointParameters {
  organizationId: string;
  permissionGroupId: string;
}
export interface IGetPermissionGroupAssigneesEndpointResult extends IEndpointResultBase {
  resources: Array<IResourceWithDescriptor<any>>;
}

export type IUnassignPermissionGroupInputItem = {
  permissionGroupId: string;
  entity: IPermissionItemEntity;
};
export interface IUnassignPermissionGroupsEndpointParameters {
  organizationId: string;
  items: IUnassignPermissionGroupInputItem[];
}

export interface IUpdatePermissionGroupEndpointParameters {
  permissionGroupId: string;
  permissionGroup: Partial<IPermissionGroupInput>;
}
export interface IUpdatePermissionGroupEndpointResult extends IEndpointResultBase {
  permissionGroup: IPermissionGroup;
}

const createPermissionGroupYupSchema = yupObject<ICreatePermissionGroupEndpointParameters>({
  organizationId: yup.string(),
  permissionGroup: skValidationSchemas.newPermissionGroupInput,
});

async function createPermissionGroup(props: ICreatePermissionGroupEndpointParameters) {
  return invokeEndpointWithAuth<ICreatePermissionGroupEndpointResult>({
    path: `${baseURL}/createPermissionGroup`,
    data: createPermissionGroupYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

const updatePermissionGroupYupSchema = yupObject<IUpdatePermissionGroupEndpointParameters>({
  permissionGroupId: yup.string(),
  permissionGroup: skValidationSchemas.updatePermissionGroupInput,
});

async function updatePermissionGroup(props: IUpdatePermissionGroupEndpointParameters) {
  return invokeEndpointWithAuth<IUpdatePermissionGroupEndpointResult>({
    path: `${baseURL}/updatePermissionGroup`,
    data: updatePermissionGroupYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

const assignPermissionGroupsYupSchema = yupObject<IAssignPermissionGroupsEndpointParameters>({
  organizationId: yup.string(),
  items: yup.array().of(
    yupObject<IAssignPermissionGroupInputItem>({
      permissionGroupId: yup.string(),
      entity: skValidationSchemas.permissionItemEntityRequired,
      order: yup.number(),
    })
  ),
});

async function assignPermissionGroups(props: IAssignPermissionGroupsEndpointParameters) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/assignPermissionGroups`,
    data: assignPermissionGroupsYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

const deletePermissionGroupsYupSchema = yupObject<IDeletePermissionGroupsEndpointParameters>({
  workspaceId: yup.string(),
  permissionGroupIds: yup.array().of(yup.string()),
});

async function deletePermissionGroups(props: IDeletePermissionGroupsEndpointParameters) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/deletePermissionGroups`,
    data: deletePermissionGroupsYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

const getAssignedPermissionGroupListYupSchema =
  yupObject<IGetAssignedPermissionGroupListEndpointParameters>({
    organizationId: yup.string(),
    container: skValidationSchemas.permissionGroupContainer,
    entity: skValidationSchemas.permissionItemEntityRequired,
  });

async function getAssignedPermissionGroupList(
  props: IGetAssignedPermissionGroupListEndpointParameters
) {
  return invokeEndpointWithAuth<IGetAssignedPermissionGroupListEndpointResult>({
    path: `${baseURL}/getAssignedPermissionGroupList`,
    data: getAssignedPermissionGroupListYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

const getContainerPermissionGroupListYupSchema =
  yupObject<IGetContainerPermissionGroupListEndpointParameters>({
    workspaceId: yup.string(),
    container: skValidationSchemas.permissionGroupContainer,
  });

async function getContainerPermissionGroupList(
  props: IGetContainerPermissionGroupListEndpointParameters
) {
  return invokeEndpointWithAuth<IGetContainerPermissionGroupListEndpointResult>({
    path: `${baseURL}/getContainerPermissionGroupList`,
    data: getContainerPermissionGroupListYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

const getPermissionGroupAssigneesYupSchema =
  yupObject<IGetPermissionGroupAssigneesEndpointParameters>({
    organizationId: yup.string(),
    permissionGroupId: yup.string(),
  });

async function getPermissionGroupAssignees(props: IGetPermissionGroupAssigneesEndpointParameters) {
  return invokeEndpointWithAuth<IGetPermissionGroupAssigneesEndpointResult>({
    path: `${baseURL}/getPermissionGroupAssignees`,
    data: getPermissionGroupAssigneesYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

const unassignPermissionGroupYupSchema = yupObject<IUnassignPermissionGroupsEndpointParameters>({
  organizationId: yup.string(),
  items: yup.array().of(
    yupObject<IUnassignPermissionGroupInputItem>({
      entity: skValidationSchemas.permissionItemEntityRequired,
      permissionGroupId: yup.string(),
    })
  ),
});

async function unassignPermissionGroup(props: IUnassignPermissionGroupsEndpointParameters) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/unassignPermissionGroup`,
    data: unassignPermissionGroupYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export class PermissionGroupsAPI {
  static createPermissionGroup = createPermissionGroup;
  static updatePermissionGroup = updatePermissionGroup;
  static assignPermissionGroups = assignPermissionGroups;
  static deletePermissionGroups = deletePermissionGroups;
  static getAssignedPermissionGroupList = getAssignedPermissionGroupList;
  static getContainerPermissionGroupList = getContainerPermissionGroupList;
  static getPermissionGroupAssignees = getPermissionGroupAssignees;
  static unassignPermissionGroup = unassignPermissionGroup;
}
