import * as yup from "yup";
import { fieldsConstants } from "../../models/fields/fields";

const name = yup
    .string()
    .trim()
    .max(fieldsConstants.maxNameLength, "Input is too long")
    .required("Field is required");

const description = yup
    .string()
    .trim()
    .max(fieldsConstants.maxDescriptionLength, "Input is too long")
    .nullable();

const field = yup.object().shape({
    name,
    description,
    type: yup.boolean().required("Field is required"),
});

export const fieldValidationSchemas = {
    name,
    description,
    field,
};
