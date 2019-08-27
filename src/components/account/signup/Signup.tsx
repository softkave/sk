import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";

import { userConstants } from "../../../models/user/constants";
import { passwordPattern, textPattern } from "../../../models/user/descriptor";
import FormError from "../../FormError";
import { getGlobalError, submitHandler } from "../../formik-utils";

// TODO: Add minimum and maximum to input helper
const passwordExtraInfo = "Minimum of 5 characters";

const emailMismatchErrorMessage = "Email does not match";
const passwordMismatchErrorMessage = "Password do not match";
const invalidNameMessage = "Name is invalid";
const invalidPasswordMessage = "Password is invalid";

// TODO: Add regex to appropriate types like password
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(userConstants.maxNameLength)
    .matches(textPattern, invalidNameMessage)
    .required(),
  email: yup
    .string()
    .email()
    .required(),
  confirmEmail: yup
    .string()
    .oneOf([yup.ref("email")], emailMismatchErrorMessage)
    .required(),
  password: yup
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .matches(passwordPattern, invalidPasswordMessage)
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], passwordMismatchErrorMessage)
    .required()
});

interface ISignupValues {
  name: string;
  email: string;
  password: string;
}

export interface ISignupProps {
  onSubmit: (values: ISignupValues) => void | Promise<void>;
}

class Signup extends React.Component<ISignupProps> {
  public render() {
    const { onSubmit } = this.props;

    return (
      <Formik
        initialValues={{
          name: undefined,
          email: undefined,
          confirmEmail: undefined,
          password: undefined,
          confirmPassword: undefined
        }}
        onSubmit={(values, props) =>
          submitHandler(onSubmit, values, {
            ...props,
            fieldsToDelete: ["confirmEmail", "confirmPassword"]
          })
        }
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => {
          const globalError = getGlobalError(errors);
          console.log({ globalError });

          return (
            <form onSubmit={handleSubmit}>
              {globalError && (
                <Form.Item>
                  <FormError error={globalError} />
                </Form.Item>
              )}
              <Form.Item
                label="Name"
                help={touched.name && <FormError>{errors.name}</FormError>}
              >
                <Input
                  autoComplete="name"
                  name="name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item
                label="Email Address"
                help={touched.email && <FormError>{errors.email}</FormError>}
              >
                <Input
                  autoComplete="email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Email Address"
                help={
                  touched.confirmEmail && (
                    <FormError>{errors.confirmEmail}</FormError>
                  )
                }
              >
                <Input
                  autoComplete="email"
                  name="confirmEmail"
                  value={values.confirmEmail}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                // extra={passwordExtraInfo}
                help={
                  touched.password && errors.password ? (
                    <FormError>{errors.password}</FormError>
                  ) : (
                    passwordExtraInfo
                  )
                }
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                help={
                  touched.confirmPassword && (
                    <FormError>{errors.confirmPassword}</FormError>
                  )
                }
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Create Account
                </Button>
              </Form.Item>
            </form>
          );
        }}
      </Formik>
    );
  }
}

export default Signup;
