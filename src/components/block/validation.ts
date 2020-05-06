import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";

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
  description: descriptionOptional.required(),
});

const task = yup.object().shape({
  description: descriptionOptional.required(),
  parent: yup.string().required(),

  // TODO: what should be the max?
  subTasks: yup.array().of(subTaskSchema).max(blockConstants.maxSubTasksLength),
});

const blockValidationSchemas = {
  name,
  nameOptional,
  descriptionOptional,
  org,
  task,
};

export default blockValidationSchemas;
