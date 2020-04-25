import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";

const name = yup
  .string()
  .max(blockConstants.maxLabelNameLength)
  .matches(textPattern)
  .required();

const description = yup
  .string()
  .max(blockConstants.maxLabelDescriptionLength)
  .matches(textPattern)
  .nullable();

export const labelValidationSchemas = {
  name,
  description,
};
