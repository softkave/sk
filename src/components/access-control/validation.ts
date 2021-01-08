import * as yup from "yup";
import { accessControlConstants } from "../../models/access-control/constants";

const name = yup
    .string()
    .trim()
    .max(
        accessControlConstants.maxPermissionGroupNameLength,
        "Input is too long"
    )
    .required("Field is required");

const description = yup
    .string()
    .trim()
    .max(
        accessControlConstants.maxPermissionGroupDescriptionLength,
        "Input is too long"
    )
    .nullable();

const permissionGroup = yup.object().shape({
    name,
    description,
});

export const permissionGroupValidationSchemas = {
    name,
    description,
    permissionGroup,
};
