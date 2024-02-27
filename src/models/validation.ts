import * as yup from "yup";
import { yupObject } from "../utils/validation";
import {
  IPermissionGroupContainer,
  IPermissionGroupInput,
  IPermissionItemEntity,
  IPermissionItemTarget,
} from "./permissions/types";

const permissionGroupContainer = yupObject<IPermissionGroupContainer>({
  containerId: yup.string().required(),
  containerType: yup.string().required(),
});
const permissionItemEntityRequired = yupObject<IPermissionItemEntity>({
  entityId: yup.string().required(),
  entityType: yup.string().required(),
});
const permissionItemEntity = yupObject<IPermissionItemEntity>({
  entityId: yup.string(),
  entityType: yup.string().required(),
});
const permissionItemTarget = yupObject<IPermissionItemTarget>({
  containerId: yup.string().required(),
  containerType: yup.string().required(),
  targetId: yup.string().required(),
  targetType: yup.string().required(),
});
const newPermissionGroupInput = yupObject<IPermissionGroupInput>({
  name: yup.string().required(),
  description: yup.string().required(),
  container: permissionGroupContainer.required(),
});
const updatePermissionGroupInput = yupObject<IPermissionGroupInput>({
  name: yup.string(),
  description: yup.string(),
  container: permissionGroupContainer,
});

export const skValidationSchemas = {
  newPermissionGroupInput,
  updatePermissionGroupInput,
  permissionGroupContainer,
  permissionItemEntityRequired,
  permissionItemEntity,
  permissionItemTarget,
};
