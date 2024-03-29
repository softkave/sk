import { Button, Form, Input, Typography } from "antd";
import { memoize } from "lodash";
import React from "react";
import * as yup from "yup";
import { appMessages } from "../../models/messages";
import { userConstants } from "../../models/user/constants";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import { passwordPattern, textPattern } from "../../models/user/validation";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import useFormHelpers from "../hooks/useFormHelpers";
import FormFieldError from "../utils/form/FormFieldError";
import { formClassname } from "../utils/form/styles";

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
    .trim()
    .max(userConstants.maxNameLength)
    .matches(textPattern, invalidNameMessage)
    .required(appMessages.fieldIsRequired),
  email: yup
    .string()
    .trim()
    .email(userErrorMessages.invalidEmail)
    .required(appMessages.fieldIsRequired),
  confirmEmail: yup
    .string()
    .trim()
    .oneOf([yup.ref("email")], emailMismatchErrorMessage)
    .required(appMessages.fieldIsRequired),
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
    .required(appMessages.fieldIsRequired),
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

const getSignupInitialValues = memoize(
  (): ISignupFormInternalData => {
    return {
      confirmEmail: "",
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    };
  },
  () => "signup"
);

export interface ISignupProps {
  onSubmit: (values: ISignupFormData) => void | Promise<void>;

  // TODO: error from container and flattening
  errors?: IFormikFormErrors<ISignupFormData>;
  isSubmitting?: boolean;
}

const Signup: React.FC<ISignupProps> = (props) => {
  const { onSubmit, isSubmitting, errors: externalErrors } = props;
  const { formik } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      validationSchema,
      initialValues: getSignupInitialValues(),
      onSubmit: (data) => {
        onSubmit({
          email: data.email,
          name: data.name,
          password: data.password,
        });
      },
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;
  const globalError = getFormError(errors);

  return (
    <form onSubmit={handleSubmit} className={formClassname}>
      <Form.Item>
        <Typography.Title level={5}>Signup</Typography.Title>
      </Form.Item>
      {globalError && (
        <Form.Item>
          <FormFieldError error={globalError} />
        </Form.Item>
      )}
      <Form.Item
        required
        label="Name"
        help={touched?.name && errors?.name && <FormFieldError error={errors.name} />}
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
        help={touched?.email && errors?.email && <FormFieldError error={errors.email} />}
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
          errors?.confirmEmail && <FormFieldError error={errors.confirmEmail} />
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
            <FormFieldError error={errors?.password} />
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
          errors?.confirmPassword && <FormFieldError error={errors.confirmPassword} />
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
        <Button block type="primary" htmlType="submit" loading={isSubmitting}>
          {isSubmitting ? "Creating Account" : "Create Account"}
        </Button>
      </Form.Item>
    </form>
  );
};

export default React.memo(Signup);
