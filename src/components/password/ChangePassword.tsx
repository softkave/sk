import { Button, Form, Input } from "antd";
import React from "react";
import * as yup from "yup";
import { userConstants } from "../../models/user/constants";
import { passwordPattern } from "../../models/user/validation";
import cast from "../../utils/cast";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import { FormBody } from "../form/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";

// TODO: Move to a central place ( errorMessages )
const invalidPasswordMessage = "Password is invalid";
const passwordMismatchErrorMessage = "Passwords do not match";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .matches(passwordPattern, invalidPasswordMessage)
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], passwordMismatchErrorMessage)
    .required(),
});

export interface IChangePasswordFormData {
  password: string;
}

interface IChangePasswordFormInternalData extends IChangePasswordFormData {
  confirmPassword: string;
}

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
      initialValues: cast<IChangePasswordFormInternalData>({}),
      validationSchema,
      onSubmit: async (data) => {
        onSubmit({
          password: data.password,
        });
      },
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = formik;
  const globalError = getGlobalError(errors);

  return (
    <FormBody>
      <form onSubmit={handleSubmit}>
        <h2>Change Password</h2>
        {globalError && (
          <Form.Item>
            <FormError error={globalError} />
          </Form.Item>
        )}
        <Form.Item
          required
          label="Password"
          help={touched.password && <FormError>{errors.password}</FormError>}
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
            touched.confirmPassword && (
              <FormError>{errors.confirmPassword}</FormError>
            )
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
          <Button block type="primary" htmlType="submit" loading={isSubmitting}>
            {isSubmitting ? "Changing Your Password" : "Change Password"}
          </Button>
        </Form.Item>
      </form>
    </FormBody>
  );
};

export default React.memo(ChangePassword);
