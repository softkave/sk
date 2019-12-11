import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import withFormikFormWrapper from "../form/withFormikFormWrapper";
import EditOrgForm from "./EditOrgForm";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(blockConstants.maxNameLength)
    .matches(textPattern)
    .required(),
  description: yup
    .string()
    .max(blockConstants.maxDescriptionLength)
    .matches(textPattern)
});

const EditOrgFormWithFormikWrapper = withFormikFormWrapper({
  validationSchema
})(EditOrgForm);

export default EditOrgFormWithFormikWrapper;
