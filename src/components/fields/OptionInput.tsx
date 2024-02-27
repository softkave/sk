import { Form } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import { noop } from "lodash";
import React from "react";
import { IOption } from "../../models/fields/fields";
import FormFieldError from "../utils/form/FormFieldError";
import InputWithControls from "../utils/InputWithControls";

export interface IOptionInputProps {
  value: IOption;
  onChange: (data: Partial<IOption>) => void;
  disabled?: boolean;
  isNew?: boolean;
  touched?: FormikTouched<IOption>;
  errors?: FormikErrors<IOption>;
}

const OptionsInput: React.FC<IOptionInputProps> = (props) => {
  const { value, disabled, touched, errors, onChange } = props;

  return (
    <div>
      <Form.Item
        label="Option"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        help={touched?.option && <FormFieldError error={errors?.option} />}
      >
        <InputWithControls
          hideControls
          inputOnly
          revertChanges={noop}
          value={value.option}
          onChange={(val) => {
            onChange({ option: val });
          }}
          autoComplete="off"
          disabled={disabled}
          placeholder="Option"
          bordered={false}
        />
      </Form.Item>
      <Form.Item
        label="Description"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        help={touched?.description && <FormFieldError error={errors?.description} />}
      >
        <InputWithControls
          hideControls
          inputOnly
          revertChanges={noop}
          value={value.description}
          onChange={(val) => {
            onChange({ description: val });
          }}
          autoComplete="off"
          disabled={disabled}
          placeholder="Description"
          bordered={false}
        />
      </Form.Item>
    </div>
  );
};

export default OptionsInput;
