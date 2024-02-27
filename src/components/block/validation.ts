import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { INewOrganizationInput } from "../../models/organization/types";
import { textPattern } from "../../models/user/validation";
import { yupObject } from "../../utils/validation";

// TODO: add error messages and help to form items, like the max strings, and if
// they are required

const nameOptional = yup.string().trim().max(blockConstants.maxNameLength).matches(textPattern);
const name = nameOptional.required();
const descriptionOptional = yup
  .string()
  .trim()
  .max(blockConstants.maxDescriptionLength)
  .matches(textPattern)
  .nullable();

const org = yupObject<INewOrganizationInput>({
  name,
  description: descriptionOptional,
  color: yup.string().optional(),
});

const subTaskSchema = yup.object().shape({
  description: descriptionOptional.required("Field is required"),
});

const subTasks = yup.array().of(subTaskSchema).max(blockConstants.maxSubTasks);
const parent = yup.string().required();
const newTask = yup.object().shape({
  name,
  description: descriptionOptional,

  // TODO: what should be the max?
  subTasks,
});

const updateTask = yup.object().shape({
  name: nameOptional.nullable(),
  description: descriptionOptional,

  // TODO: what should be the max?
  subTasks,
});

const blockValidationSchemas = {
  name,
  nameOptional,
  descriptionOptional,
  org,
  newTask,
  updateTask,
};

export default blockValidationSchemas;
