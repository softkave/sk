import { css } from "@emotion/css";
import { Button, Divider, Form, Input, Typography } from "antd";
import React from "react";
import * as yup from "yup";
import { messages } from "../../models/messages";
import { userConstants } from "../../models/user/constants";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import {
  formClasses,
  formClassname,
  formSectionClassname,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import { userValidationSchemas } from "./validation";

const validationSchema = yup.object().shape({
  currentPassword: userValidationSchemas.password.required(),
  password: userValidationSchemas.password.required(),
  confirmPassword: userValidationSchemas.confirmPassword.required(),
});

export interface IChangePasswordFormData {
  currentPassword: string;
  password: string;
}

interface IChangePasswordFormInternalData extends IChangePasswordFormData {
  confirmPassword: string;
}

export interface IChangePasswordFormProps {
  onSubmit: (values: IChangePasswordFormData) => void | Promise<void>;
  errors?: IFormikFormErrors<IChangePasswordFormData>;
  isSubmitting?: boolean;
}

const ChangePasswordForm: React.FC<IChangePasswordFormProps> = (props) => {
  const { onSubmit, isSubmitting, errors: externalErrors } = props;
  const { formik } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      validationSchema,
      initialValues: {} as IChangePasswordFormInternalData,
      onSubmit: (data) => {
        onSubmit({
          currentPassword: data.currentPassword,
          password: data.password,
        });
      },
    },
  });

  const globalError = getFormError(formik.errors);
  const passwordNode = (
    <React.Fragment>
      <Form.Item
        required
        label={messages.currentPasswordLabel}
        help={
          formik.touched?.currentPassword &&
          formik.errors?.currentPassword && (
            <FormError error={formik.errors?.currentPassword} />
          )
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.Password
          visibilityToggle
          autoComplete="current-password"
          name="currentPassword"
          value={formik.values.currentPassword}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          disabled={isSubmitting}
          placeholder={messages.currentPasswordPlaceholder}
          maxLength={userConstants.maxPasswordLength}
        />
      </Form.Item>
      <Divider />
      <Form.Item
        required
        label={messages.newPasswordLabel}
        help={
          formik.touched?.password && formik.errors?.password ? (
            <FormError error={formik.errors?.password} />
          ) : (
            messages.passwordMinCharacters
          )
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.Password
          visibilityToggle
          autoComplete="new-password"
          name="password"
          value={formik.values.password}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          disabled={isSubmitting}
          placeholder={messages.passwordPlaceholder}
          maxLength={userConstants.maxPasswordLength}
        />
      </Form.Item>
      <Form.Item
        required
        label={messages.confirmPasswordLabel}
        help={
          formik.touched?.confirmPassword &&
          formik.errors?.confirmPassword && (
            <FormError error={formik.errors.confirmPassword} />
          )
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.Password
          visibilityToggle
          autoComplete="new-password"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          disabled={isSubmitting}
          placeholder={messages.confirmPasswordPlaceholder}
          maxLength={userConstants.maxPasswordLength}
        />
      </Form.Item>
    </React.Fragment>
  );

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={formClasses.form}
      style={{ height: "auto" }}
    >
      <div className={formClasses.formContent}>
        <Form.Item>
          <Typography.Title level={4}>Password</Typography.Title>
        </Form.Item>
        {globalError && (
          <Form.Item>
            <FormError error={globalError} />
          </Form.Item>
        )}
        <div className={formSectionClassname}>{passwordNode}</div>
        <Form.Item
          className={css({
            marginTop: "24px",
          })}
        >
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {isSubmitting ? "Changing Password" : "Change Password"}
          </Button>
        </Form.Item>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
