import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/validation";

// TODO: add error messages and help to form items, like the max strings, and if they are required

const nameOptional = yup
  .string()
  .max(blockConstants.maxNameLength)
  .matches(textPattern);

const name = nameOptional.required();

const descriptionOptional = yup
  .string()
  .max(blockConstants.maxDescriptionLength)
  .matches(textPattern)
  .nullable();

const org = yup.object().shape({
  name,
  description: descriptionOptional,
});

const subTaskSchema = yup.object().shape({
  description: descriptionOptional.required("Field is required"),
});

const subTasks = yup
  .array()
  .of(subTaskSchema)
  .max(blockConstants.maxSubTasksLength);
const parent = yup.string().required();

const newTask = yup.object().shape({
  name,
  description: descriptionOptional,
  parent,

  // TODO: what should be the max?
  subTasks,
});

const updateTask = yup.object().shape({
  name: nameOptional.nullable(),
  description: descriptionOptional,
  parent,

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
