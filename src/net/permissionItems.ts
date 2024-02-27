import * as yup from "yup";
import {
  IPermissionGroupContainer,
  IPermissionItem,
  IPermissionItemEntity,
  IPermissionItemInput,
  IPermissionItemTarget,
  SoftkavePermissionActions,
} from "../models/permissions/types";
import { skValidationSchemas } from "../models/validation";
import { yupObject } from "../utils/validation";
import { invokeEndpointWithAuth } from "./invokeEndpoint";
import { IEndpointResultBase } from "./types";
import { endpointYupOptions } from "./utils";

const baseURL = "/permissionItems";

export interface ICreatePermissionItemsEndpointParameters {
  organizationId: string;
  items: IPermissionItemInput[];
}
export interface ICreatePermissionItemsEndpointResult extends IEndpointResultBase {
  items: IPermissionItem[];
}

export interface IDeletePermissionItemInput {
  entity?: IPermissionItemEntity;
  action?: SoftkavePermissionActions;
  target?: IPermissionItemTarget;
  allow?: boolean;
}
export interface IDeletePermissionItemsEndpointParameters {
  organizationId: string;
  items: IDeletePermissionItemInput[];
}

export interface IGetPermissionItemListEndpointParameters {
  organizationId: string;
  container: IPermissionGroupContainer;
  entity?: IPermissionItemEntity;
  target?: IPermissionItemTarget;
  action?: SoftkavePermissionActions;
  allow?: boolean;
}
export interface IGetPermissionItemListEndpointResult extends IEndpointResultBase {
  permissionList: IPermissionItem[];
}

const createPermissionItemsYupSchema = yupObject<ICreatePermissionItemsEndpointParameters>({
  organizationId: yup.string(),
  items: yup.array().of(
    yupObject<IPermissionItemInput>({
      action: yup.string(),
      allow: yup.string(),
      entity: skValidationSchemas.permissionItemEntity,
      target: skValidationSchemas.permissionItemTarget,
    })
  ),
});

async function createPermissionItems(props: ICreatePermissionItemsEndpointParameters) {
  return invokeEndpointWithAuth<ICreatePermissionItemsEndpointResult>({
    path: `${baseURL}/createPermissionItems`,
    data: createPermissionItemsYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

const deletePermissionItemsYupSchema = yupObject<IDeletePermissionItemsEndpointParameters>({
  organizationId: yup.string(),
  items: yup.array().of(
    yupObject<IPermissionItemInput>({
      action: yup.string(),
      allow: yup.string(),
      entity: skValidationSchemas.permissionItemEntity,
      target: skValidationSchemas.permissionItemTarget,
    })
  ),
});

async function deletePermissionItems(props: IDeletePermissionItemsEndpointParameters) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/deletePermissionItems`,
    data: deletePermissionItemsYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

const getPermissionItemListYupSchema = yupObject<IGetPermissionItemListEndpointParameters>({
  organizationId: yup.string(),
  action: yup.string(),
  allow: yup.string(),
  entity: skValidationSchemas.permissionItemEntity,
  target: skValidationSchemas.permissionItemTarget,
  container: skValidationSchemas.permissionGroupContainer,
});

async function getPermissionItemList(props: IGetPermissionItemListEndpointParameters) {
  return invokeEndpointWithAuth<IGetPermissionItemListEndpointResult>({
    path: `${baseURL}/getPermissionItemList`,
    data: getPermissionItemListYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export class PermissionItemsAPI {
  static createPermissionItems = createPermissionItems;
  static deletePermissionItems = deletePermissionItems;
  static getPermissionItemList = getPermissionItemList;
}
