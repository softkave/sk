import { Button, Form, Input, notification } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";

import { userConstants } from "../../../models/user/constants";
import { passwordPattern } from "../../../models/user/descriptor";
import FormError from "../../form/FormError";
import { getGlobalError, submitHandler } from "../../formik-utils";

const changePasswordSuccessMessage = "Password changed successfully";
const invalidPasswordMessage = "Password is invalid";
const passwordMismatchErrorMessage = "Password do not match";

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
    .required()
});

interface IChangePasswordValues {
  password: string;
}

export interface IChangePasswordProps {
  onSubmit: (values: IChangePasswordValues) => void | Promise<void>;
}

class ChangePassword extends React.Component<IChangePasswordProps> {
  public render() {
    const { onSubmit } = this.props;

    return (
      <Formik
        initialValues={{ password: undefined, confirmPassword: undefined }}
        validationSchema={validationSchema}
        onSubmit={async (values, props) => {
          submitHandler(onSubmit, values, {
            ...props,
            fieldsToDelete: ["confirmPassword"],
            onSuccess() {
              notification.success({
                message: "Change Password",
                description: changePasswordSuccessMessage,
                duration: 0
              });
            }
          });
        }}
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

          return (
            <form onSubmit={handleSubmit}>
              {globalError && (
                <Form.Item>
                  <FormError error={globalError} />
                </Form.Item>
              )}
              <Form.Item
                label="Password"
                help={<FormError>{errors.password}</FormError>}
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                help={<FormError>{errors.confirmPassword}</FormError>}
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Change Password
                </Button>
              </Form.Item>
            </form>
          );
        }}
      </Formik>
    );
  }
}

export default ChangePassword;
