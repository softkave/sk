import { Button, Form, Input } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import moment from "moment";
import React from "react";
import { Trash } from "react-feather";
import { IAddCollaboratorFormItemValues } from "../../models/types";
import FormError from "../form/FormError";
import StyledContainer from "../styled/Container";
import ExpiresAt from "./ExpiresAt";
import Message from "./Message";

export interface IAddCollaboratorFormItemProps {
  value: IAddCollaboratorFormItemValues;
  onChange: (value: Partial<IAddCollaboratorFormItemValues>) => void;
  onDelete: (value: IAddCollaboratorFormItemValues) => void;

  disabled?: boolean;
  errors?: FormikErrors<IAddCollaboratorFormItemValues>;
  touched?: FormikTouched<IAddCollaboratorFormItemValues>;
  style?: React.CSSProperties;
}

const AddCollaboratorFormItem = React.memo<IAddCollaboratorFormItemProps>(
  (props) => {
    const {
      errors,
      onChange,
      onDelete,
      value,
      disabled,
      touched,
      style,
    } = props;

    return (
      <StyledContainer
        s={{
          width: "100%",
          flexDirection: "column",
          padding: "32px 0",
          ...(style || {}),
        }}
      >
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={
            touched?.email &&
            errors?.email && <FormError error={errors?.email} />
          }
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
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={
            touched?.body && errors?.body && <FormError error={errors?.body} />
          }
          style={{ marginBottom: 8 }}
        >
          <Message
            placeholder="Enter request message"
            value={value.body}
            onChange={(body) => {
              onChange({ body });
            }}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={
            touched?.expiresAt &&
            errors?.expiresAt && <FormError error={errors?.expiresAt} />
          }
          style={{ marginBottom: 8 }}
        >
          <ExpiresAt
            placeholder="Select request expiration date"
            value={value.expiresAt}
            minDate={moment().subtract(1, "day").endOf("day")}
            onChange={(date) => {
              onChange({ expiresAt: date });
            }}
            disabled={disabled}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <StyledContainer>
          <Button
            disabled={disabled}
            icon={<Trash style={{ width: "14px" }} />}
            onClick={() => onDelete(value)}
            htmlType="button"
          />
        </StyledContainer>
      </StyledContainer>
    );
  }
);

export default AddCollaboratorFormItem;
