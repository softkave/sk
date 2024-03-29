import { Button, Form, Input } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { Trash2 } from "react-feather";
import FormFieldError from "../utils/form/FormFieldError";

export interface IAddCollaboratorFormItemValues {
  email: string;
}

export interface IAddCollaboratorFormItemProps {
  value: IAddCollaboratorFormItemValues;
  onChange: (value: Partial<IAddCollaboratorFormItemValues>) => void;
  onDelete: (value: IAddCollaboratorFormItemValues) => void;
  disabled?: boolean;
  errors?: FormikErrors<IAddCollaboratorFormItemValues>;
  touched?: FormikTouched<IAddCollaboratorFormItemValues>;
  style?: React.CSSProperties;
}

const AddCollaboratorFormItem = React.memo<IAddCollaboratorFormItemProps>((props) => {
  const { errors, onChange, onDelete, value, disabled, touched, style } = props;

  return (
    <div
      style={{
        width: "100%",
        flexDirection: "column",

        ...(style || {}),
      }}
    >
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        help={touched?.email && errors?.email && <FormFieldError error={errors?.email} />}
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder="Enter recipient's email address"
          value={value.email}
          autoComplete="email"
          onChange={(event) => {
            onChange({ email: event.target.value });
          }}
          disabled={disabled}
        />
      </Form.Item>
      <div style={{ marginTop: "4px" }}>
        <Button
          disabled={disabled}
          icon={<Trash2 />}
          onClick={() => onDelete(value)}
          htmlType="button"
          className="icon-btn"
        />
      </div>
    </div>
  );
});

export default AddCollaboratorFormItem;
