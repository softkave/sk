import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import withFormikFormWrapper from "../form/withFormikFormWrapper";
import GroupForm from "./GroupForm";

// TODO: Add custom messages to the schemas
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
    .matches(textPattern),
  parent: yup.string().required()
});

export default withFormikFormWrapper({ validationSchema })(GroupForm);
