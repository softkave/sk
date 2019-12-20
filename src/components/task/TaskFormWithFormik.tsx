import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import withFormikFormWrapper from "../form/withFormikFormWrapper";
import TaskForm from "./TaskForm";

const validationSchema = yup.object().shape({
  description: yup
    .string()
    .max(blockConstants.maxDescriptionLength)
    .matches(textPattern)
    .required(),
  parents: yup
    .array()
    .of(yup.string())
    .min(blockConstants.minNonRootBlockParentsLength)
    .max(blockConstants.maxParentsLength)
    .required()
});

const TaskFormWithFormik = withFormikFormWrapper({
  validationSchema,
  initialValues: { taskCollaborationType: { collaborationType: "collective" } }
})(TaskForm);

export default TaskFormWithFormik;
