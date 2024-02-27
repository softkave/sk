import { blockConstants } from "../../../../models/block/constants";
import { FormItemInputType, IFormItemInputText, IFormItemInputTextArea } from "../types";

const name: IFormItemInputText = {
  type: FormItemInputType.Text,
  autoFocus: true,
  maxLength: blockConstants.maxNameLength,
  showCount: true,
};

const description: IFormItemInputTextArea = {
  type: FormItemInputType.TextArea,
  maxLength: blockConstants.maxDescriptionLength,
  showCount: true,
  autoSize: { minRows: 3 },
};

export const blockFormItemInputs = {
  name,
  description,
};
