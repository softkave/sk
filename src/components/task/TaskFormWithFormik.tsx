import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import ErrorMessages from "../../models/errorMessages";
import { textPattern } from "../../models/user/descriptor";
import withFormikFormWrapper from "../form/withFormikFormWrapper";
import TaskForm from "./TaskForm";

const descriptionValidationSchema = yup
  .string()
  .required()
  .min(blockConstants.minDescriptionLength, ErrorMessages.fieldIsRequired)
  .max(blockConstants.maxDescriptionLength)
  .matches(textPattern, ErrorMessages.invalidText);

const subTaskSchema = yup.object().shape({
  description: descriptionValidationSchema
});

const validationSchema = yup.object().shape({
  description: descriptionValidationSchema,
  parents: yup
    .array()
    .of(yup.string())
    .min(blockConstants.minNonRootBlockParentsLength)
    .max(blockConstants.maxParentsLength)
    .required(),

  // TODO: what should be the max?
  subTasks: yup.array().of(subTaskSchema)
});

const TaskFormWithFormik = withFormikFormWrapper({
  validationSchema,
  initialValues: { taskCollaborationData: { collaborationType: "collective" } }
})(TaskForm);

export default TaskFormWithFormik;
