import { Button, Checkbox, Form, Input, Typography } from "antd";
import { memoize } from "lodash";
import React from "react";
import * as yup from "yup";
import { userConstants } from "../../models/user/constants";
import { passwordPattern } from "../../models/user/validation";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import useFormHelpers from "../hooks/useFormHelpers";
import FormFieldError from "../utils/form/FormFieldError";
import { formClassname } from "../utils/form/styles";

// TODO: Move to a central place ( errorMessages )
const invalidPasswordMessage = "Password is invalid";
const passwordMismatchErrorMessage = "Passwords do not match";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .matches(passwordPattern, invalidPasswordMessage)
    .required(),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], passwordMismatchErrorMessage)
    .required(),
});

export interface IChangePasswordFormData {
  password: string;
  remember: boolean;
}

interface IChangePasswordFormInternalData extends IChangePasswordFormData {
  confirmPassword: string;
}

const getInitialValues = memoize(
  (): IChangePasswordFormInternalData => {
    return {
      password: "",
      confirmPassword: "",
      remember: false,
    };
  },
  () => "changePassword"
);

export interface IChangePasswordProps {
  onSubmit: (values: IChangePasswordFormData) => void | Promise<void>;

  isSubmitting?: boolean;
  errors?: IFormikFormErrors<IChangePasswordFormData>;
}

const ChangePassword: React.FC<IChangePasswordProps> = (props) => {
  const { onSubmit, isSubmitting, errors: externalErrors } = props;

  const { formik } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      initialValues: getInitialValues(),
      validationSchema,
      onSubmit: async (data) => {
        onSubmit({
          password: data.password,
          remember: data.remember,
        });
      },
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;
  const globalError = getFormError(errors);

  return (
    <div className={formClassname}>
      <form onSubmit={handleSubmit}>
        <Form.Item>
          <Typography.Title level={5}>Change Password</Typography.Title>
        </Form.Item>
        {globalError && (
          <Form.Item>
            <FormFieldError error={globalError} />
          </Form.Item>
        )}
        <Form.Item
          required
          label="Password"
          help={touched.password && <FormFieldError>{errors.password}</FormFieldError>}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input.Password
            visibilityToggle
            autoComplete="new-password"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            placeholder="Enter new password"
            disabled={isSubmitting}
            maxLength={userConstants.maxPasswordLength}
          />
        </Form.Item>
        <Form.Item
          required
          label="Confirm Password"
          help={
            touched.confirmPassword && <FormFieldError>{errors.confirmPassword}</FormFieldError>
          }
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input.Password
            visibilityToggle
            autoComplete="new-password"
            name="confirmPassword"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.confirmPassword}
            placeholder="Re-enter your new password"
            disabled={isSubmitting}
            maxLength={userConstants.maxPasswordLength}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox
            name="remember"
            onChange={handleChange}
            checked={values.remember}
            disabled={isSubmitting}
          >
            Remember Me
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={isSubmitting}>
            {isSubmitting ? "Changing Your Password" : "Change Password"}
          </Button>
        </Form.Item>
      </form>
    </div>
  );
};

export default React.memo(ChangePassword);
