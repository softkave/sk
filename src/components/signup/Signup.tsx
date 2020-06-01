import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import ErrorMessages from "../../models/ErrorMessages";
import { userConstants } from "../../models/user/constants";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import { passwordPattern, textPattern } from "../../models/user/validation";
import cast from "../../utils/cast";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import { FormBody } from "../form/FormStyledComponents";
import useInsertFormikErrors from "../hooks/useInsertFormikErrors";

// TODO: Add minimum and maximum to input helper
const passwordExtraInfo = "Minimum of 7 characters";

const emailMismatchErrorMessage = "Email does not match";
const passwordMismatchErrorMessage = "Password do not match";
const invalidNameMessage = "Name is invalid";
const invalidPasswordMessage = "Password is invalid";

// TODO: Add regex to appropriate types like password
// TODO: add correct error messages to your forms
// TODO: should we have a max email length
/** TODO: more descriptive password hint, like the mix of characters and a strenght bar */
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(userConstants.maxNameLength)
    .matches(textPattern, invalidNameMessage)
    .required(ErrorMessages.fieldIsRequired),
  email: yup
    .string()
    .email(userErrorMessages.invalidEmail)
    .required(ErrorMessages.fieldIsRequired),
  confirmEmail: yup
    .string()
    .oneOf([yup.ref("email")], emailMismatchErrorMessage)
    .required(ErrorMessages.fieldIsRequired),
  password: yup
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .matches(passwordPattern, invalidPasswordMessage)
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], passwordMismatchErrorMessage)
    .required(ErrorMessages.fieldIsRequired),
});

export interface ISignupFormData {
  name: string;
  email: string;
  password: string;
}

interface ISignupFormInternalData extends ISignupFormData {
  confirmEmail: string;
  confirmPassword: string;
}

export interface ISignupProps {
  onSubmit: (values: ISignupFormData) => void | Promise<void>;

  // TODO: error from container and flattening
  errors?: IFormikFormErrors<ISignupFormData>;
  isSubmitting?: boolean;
}

const Signup: React.FC<ISignupProps> = (props) => {
  const { onSubmit, isSubmitting, errors: externalErrors } = props;

  const formikRef = useInsertFormikErrors(externalErrors);

  return (
    <Formik
      initialValues={cast<ISignupFormInternalData>({})}
      onSubmit={(values) => {
        onSubmit({
          email: values.email,
          name: values.name,
          password: values.password,
        });
      }}
      validationSchema={validationSchema}
    >
      {(formikProps) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        } = formikProps;
        formikRef.current = formikProps;
        const globalError = getGlobalError(errors);

        return (
          <FormBody>
            <form onSubmit={handleSubmit}>
              <h2>Signup</h2>
              {globalError && (
                <Form.Item>
                  <FormError error={globalError} />
                </Form.Item>
              )}
              <Form.Item
                required
                label="Name"
                help={
                  touched?.name &&
                  errors?.name && <FormError error={errors.name} />
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  autoComplete="name"
                  name="name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter your first name and last name"
                  disabled={isSubmitting}
                  maxLength={userConstants.maxNameLength}
                />
              </Form.Item>
              <Form.Item
                required
                label="Email Address"
                help={
                  touched?.email &&
                  errors?.email && <FormError error={errors.email} />
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  autoComplete="email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Enter your email address"
                />
              </Form.Item>
              <Form.Item
                required
                label="Confirm Email Address"
                help={
                  touched?.confirmEmail &&
                  errors?.confirmEmail && (
                    <FormError error={errors.confirmEmail} />
                  )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  autoComplete="email"
                  name="confirmEmail"
                  value={values.confirmEmail}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Re-enter your email address"
                />
              </Form.Item>
              <Form.Item
                required
                label="Password"
                // extra={passwordExtraInfo}
                help={
                  touched?.password && errors?.password ? (
                    <FormError error={errors?.password} />
                  ) : (
                    passwordExtraInfo
                  )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Enter new password"
                  maxLength={userConstants.maxPasswordLength}
                />
              </Form.Item>
              <Form.Item
                required
                label="Confirm Password"
                help={
                  touched?.confirmPassword &&
                  errors?.confirmPassword && (
                    <FormError error={errors.confirmPassword} />
                  )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Re-enter your new password"
                  maxLength={userConstants.maxPasswordLength}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Creating Account" : "Create Account"}
                </Button>
              </Form.Item>
            </form>
          </FormBody>
        );
      }}
    </Formik>
  );
};

export default React.memo(Signup);
