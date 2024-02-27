import { css } from "@emotion/css";
import { Checkbox, InputNumber } from "antd";
import { Form } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import {
  fieldsConstants,
  IFeedbackFieldDropdownTypeMeta,
} from "../../models/fields/fields";

export interface IDropdownFieldFormProps {
  value: IFeedbackFieldDropdownTypeMeta;
  onChange: (data: Partial<IFeedbackFieldDropdownTypeMeta>) => void;
  disabled?: boolean;
  touched?: FormikTouched<IFeedbackFieldDropdownTypeMeta>;
  errors?: FormikErrors<IFeedbackFieldDropdownTypeMeta>;
}

const DropdownFieldForm: React.FC<IDropdownFieldFormProps> = (props) => {
  const { touched, errors, value, onChange, disabled } = props;

  const splitClass = css({
    display: "flex",
    flex: 1,
    marginRight: "16px",
  });

  return (
    <div style={{ flexDirection: "column", width: "100%" }}>
      <div>
        <div className={splitClass}>
          <Form.Item
            label="Min"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <Checkbox
              value={value.multiple}
              onChange={(evt) => {
                onChange({ multiple: evt.target.checked });
              }}
              disabled={disabled}
            >
              Multiple
            </Checkbox>
          </Form.Item>
        </div>
        <div className={splitClass}>
          <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
            <InputNumber
              autoComplete="off"
              // onBlur={(evt) => handleBlur && handleBlur("max", evt)}
              onChange={(num) => {
                onChange({ max: Number(num) });
              }}
              value={value.max}
              disabled={disabled}
              max={fieldsConstants.maxMetaOptions}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default DropdownFieldForm;
