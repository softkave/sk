import { css } from "@emotion/css";
import { Button, Divider, Form, Input, Typography } from "antd";
import React from "react";
import * as yup from "yup";
import { appMessages } from "../../models/messages";
import { userConstants } from "../../models/user/constants";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import useFormHelpers from "../hooks/useFormHelpers";
import FormFieldError from "../utils/form/FormFieldError";
import { formClasses, formSectionClassname } from "../utils/form/styles";
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
  isDisabled?: boolean;
}

const ChangePasswordForm: React.FC<IChangePasswordFormProps> = (props) => {
  const { onSubmit, isSubmitting, isDisabled, errors: externalErrors } = props;
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

  const isFormDisabled = isDisabled || isSubmitting;
  const globalError = getFormError(formik.errors);
  const passwordNode = (
    <React.Fragment>
      <Form.Item
        required
        label={appMessages.currentPasswordLabel}
        help={
          formik.touched?.currentPassword &&
          formik.errors?.currentPassword && (
            <FormFieldError error={formik.errors?.currentPassword} />
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
          disabled={isFormDisabled}
          placeholder={appMessages.currentPasswordPlaceholder}
          maxLength={userConstants.maxPasswordLength}
        />
      </Form.Item>
      <Divider />
      <Form.Item
        required
        label={appMessages.newPasswordLabel}
        help={
          formik.touched?.password && formik.errors?.password ? (
            <FormFieldError error={formik.errors?.password} />
          ) : (
            appMessages.passwordMinCharacters
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
          disabled={isFormDisabled}
          placeholder={appMessages.passwordPlaceholder}
          maxLength={userConstants.maxPasswordLength}
        />
      </Form.Item>
      <Form.Item
        required
        label={appMessages.confirmPasswordLabel}
        help={
          formik.touched?.confirmPassword &&
          formik.errors?.confirmPassword && <FormFieldError error={formik.errors.confirmPassword} />
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
          disabled={isFormDisabled}
          placeholder={appMessages.confirmPasswordPlaceholder}
          maxLength={userConstants.maxPasswordLength}
        />
      </Form.Item>
    </React.Fragment>
  );

  return (
    <form onSubmit={formik.handleSubmit} className={formClasses.form} style={{ height: "auto" }}>
      <div className={formClasses.formContent}>
        <Form.Item>
          <Typography.Title level={4}>Password</Typography.Title>
        </Form.Item>
        {globalError && (
          <Form.Item>
            <FormFieldError error={globalError} />
          </Form.Item>
        )}
        <div className={formSectionClassname}>{passwordNode}</div>
        <Form.Item className={css({ marginTop: "24px" })}>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {isSubmitting ? "Changing Password" : "Change Password"}
          </Button>
        </Form.Item>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
