import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";

const name = yup
  .string()
  .max(blockConstants.maxLabelNameLength, "Input is too long")
  .required("Field is required");
const description = yup
  .string()
  .max(blockConstants.maxLabelDescriptionLength, "Input is too long")
  .nullable();

const label = yup.object().shape({
  name,
  description,
});

const labelList = yup.array().of(label).max(blockConstants.maxAvailableLabels);

export const labelValidationSchemas = {
  name,
  description,
  label,
  labelList,
};
