import { IFormBag, IFormItem } from "../types";
import ColorPicker from "./ColorPicker";

const renderColor = (item: IFormItem<any>, bag: IFormBag<any>) => {
  return (
    <ColorPicker
      value={bag.values.color}
      disabled={bag.isSubmitting}
      onChange={(val) => {
        bag.setFieldValue("color", val);
      }}
    />
  );
};

export const generalFormItemInputs = {
  renderColor,
};
