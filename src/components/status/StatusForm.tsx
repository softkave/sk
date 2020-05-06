import { Form, Input } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { IBlockStatus } from "../../models/block/block";
import FormError from "../form/FormError";
import StyledContainer from "../styled/Container";

export interface IStatusFormProps {
  value: IBlockStatus;
  onChange: (data: Partial<IBlockStatus>) => void;

  disabled?: boolean;
  touched?: FormikTouched<IBlockStatus>;
  errors?: FormikErrors<IBlockStatus>;
  handleBlur?: (
    field: keyof IBlockStatus,
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const StatusForm: React.FC<IStatusFormProps> = (props) => {
  const { touched, errors, value, handleBlur, onChange, disabled } = props;

  return (
    <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        help={
          touched?.name && errors?.name && <FormError error={errors?.name} />
        }
      >
        <Input
          autoComplete="off"
          onBlur={(evt) => handleBlur && handleBlur("name", evt)}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const val = event.target.value;
            onChange({ name: val });
          }}
          value={value.name}
          placeholder="Enter status name"
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        help={
          touched?.description &&
          errors?.description && <FormError error={errors.description} />
        }
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 6 }}
          autoComplete="off"
          onBlur={(evt) => handleBlur && handleBlur("description", evt)}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const val = event.target.value;
            onChange({ description: val });
          }}
          value={value.description}
          placeholder="Enter status description"
        />
      </Form.Item>
    </StyledContainer>
  );
};

export default React.memo(StatusForm);
