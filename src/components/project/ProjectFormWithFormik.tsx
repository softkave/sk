import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import withFormikFormWrapper from "../form/withFormikFormWrapper";
import ProjectForm from "./ProjectForm";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(blockConstants.minNameLength)
    .max(blockConstants.maxNameLength)
    .matches(textPattern)
    .required(),
  description: yup
    .string()
    .max(blockConstants.maxDescriptionLength)
    .matches(textPattern)
    .nullable(),
  parent: yup.string().required()
});

export default withFormikFormWrapper({ validationSchema })(ProjectForm);
