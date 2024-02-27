import { appConstants } from "../../../../models/app/constants";
import {
  FormItemInputType,
  IFormItemInputDropdown,
  IFormItemInputText,
  IFormItemInputTextArea,
} from "../types";

const name: IFormItemInputText = {
  type: FormItemInputType.Text,
  maxLength: appConstants.maxNameLength,
  showCount: true,
};

const description: IFormItemInputTextArea = {
  type: FormItemInputType.TextArea,
  maxLength: appConstants.maxDescriptionLength,
  showCount: true,
  autoSize: { minRows: 3 },
};

const select: IFormItemInputDropdown = {
  type: FormItemInputType.Dropdown,
  allowClear: true,
};

export const appFormItemInputs = {
  name,
  description,
  select,
};
