import * as yup from "yup";
import { blockConstants } from "../block/constants";
import { textPattern } from "../user/validation";

// TODO: add error messages and help to form items, like the max strings, and if
// they are required
const name = yup.string().trim().max(blockConstants.maxNameLength).matches(textPattern);
const nameRequired = name.required();
const description = yup
  .string()
  .trim()
  .max(blockConstants.maxDescriptionLength)
  .matches(textPattern)
  .nullable();

const descriptionOptional = description.nullable();
const descriptionRequired = description.required();
export const appValidationSchemas = {
  name,
  nameRequired,
  description,
  descriptionOptional,
  descriptionRequired,
};
